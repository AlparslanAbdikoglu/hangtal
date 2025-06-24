<?php
/**
 * Plugin Name: React Woo + Clerk Auth API
 * Description: Secure REST API endpoints for WooCommerce with Clerk JWT authentication for a React frontend.
 * Version: 1.1
 * Author: Alparslan Abdikoglu
 */

if (!defined('ABSPATH')) exit;

require_once __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define('RWC_CLERK_PUBLIC_KEY', <<<KEY
-----BEGIN PUBLIC KEY-----
YOUR_CLERK_JWT_PUBLIC_KEY_HERE
-----END PUBLIC KEY-----
KEY
);

// =====================
// Register REST Routes
// =====================
add_action('rest_api_init', function () {
    register_rest_route('react-woo/v1', '/products', [
        'methods'             => 'GET',
        'callback'            => 'rwc_get_products',
        'permission_callback' => 'rwc_clerk_auth_and_set_user',
        'args' => [
            'page' => [
                'validate_callback' => 'is_numeric',
                'default'           => 1,
            ],
            'per_page' => [
                'validate_callback' => 'is_numeric',
                'default'           => 10,
            ],
            'category' => [
                'sanitize_callback' => 'sanitize_text_field',
                'required'          => false,
            ],
            's' => [
                'sanitize_callback' => 'sanitize_text_field',
                'required'          => false,
            ],
        ],
    ]);
});

// =====================
// Clerk JWT Auth
// =====================
function rwc_clerk_auth_and_set_user(WP_REST_Request $request) {
    $auth_header = $request->get_header('authorization');
    if (!$auth_header || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        return new WP_Error('unauthorized', 'Authorization token missing or invalid.', ['status' => 403]);
    }

    try {
        $token = $matches[1];
        $decoded = JWT::decode($token, new Key(RWC_CLERK_PUBLIC_KEY, 'RS256'));
        $clerk_id = $decoded->sub ?? null;
        $email = $decoded->email ?? null;

        if (!$clerk_id) {
            return new WP_Error('unauthorized', 'Clerk user ID (sub) is required in JWT.', ['status' => 403]);
        }

        // Look up existing user
        $user = get_users([
            'meta_key'   => 'clerk_user_id',
            'meta_value' => $clerk_id,
            'number'     => 1,
        ])[0] ?? null;

        // Fallback to email
        if (!$user && $email) {
            $user = get_user_by('email', $email);
            if ($user) {
                update_user_meta($user->ID, 'clerk_user_id', $clerk_id);
            }
        }

        // Create user if not exists
        if (!$user) {
            $username = 'clerk_' . sanitize_title($clerk_id);
            $user_id = wp_create_user($username, wp_generate_password(), $email ?: $username . '@example.com');
            if (is_wp_error($user_id)) return $user_id;

            $user = get_user_by('id', $user_id);
            update_user_meta($user_id, 'clerk_user_id', $clerk_id);
            $user->set_role('customer');
        }

        wp_set_current_user($user->ID);
        return true;
    } catch (Exception $e) {
        return new WP_Error('unauthorized', 'Invalid or expired token: ' . $e->getMessage(), ['status' => 403]);
    }
}

// =====================
// Product API Callback
// =====================
function rwc_get_products(WP_REST_Request $request) {
    $args = [
        'status' => 'publish',
        'limit'  => (int) $request->get_param('per_page'),
        'page'   => (int) $request->get_param('page'),
        'return' => 'objects',
    ];

    if ($cat = $request->get_param('category')) {
        $args['category'] = sanitize_title($cat);
    }

    if ($search = $request->get_param('s')) {
        $args['s'] = sanitize_text_field($search);
    }

    $products = wc_get_products($args);
    $result = [];

    foreach ($products as $product) {
        $result[] = [
            'id'          => $product->get_id(),
            'name'        => $product->get_name(),
            'slug'        => $product->get_slug(),
            'price'       => $product->get_price(),
            'sale_price'  => $product->get_sale_price(),
            'regular_price' => $product->get_regular_price(),
            'image'       => wp_get_attachment_url($product->get_image_id()),
            'gallery'     => array_map('wp_get_attachment_url', $product->get_gallery_image_ids()),
            'stock_status' => $product->get_stock_status(),
            'type'        => $product->get_type(),
            'sku'         => $product->get_sku(),
            'description' => $product->get_description(),
            'short_description' => $product->get_short_description(),
            'categories'  => array_map(function ($cat) {
                return ['id' => $cat->term_id, 'name' => $cat->name, 'slug' => $cat->slug];
            }, wp_get_post_terms($product->get_id(), 'product_cat')),
        ];
    }

    // Pagination
    $total = count((new WC_Product_Query(array_merge($args, ['limit' => -1, 'return' => 'ids'])))->get_products());
    $total_pages = ceil($total / $args['limit']);

    return new WP_REST_Response($result, 200, [
        'X-WP-Total'      => $total,
        'X-WP-TotalPages' => $total_pages,
    ]);
}
