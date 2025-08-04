<?php
/*
Plugin Name: Stripe Checkout Plugin
Description: Adds Stripe checkout session REST endpoint.
Version: 1.0
Author: Alparslan
*/

// Enable error display temporarily for debugging - remove later
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Require Stripe SDK (adjust path relative to this file)
require_once __DIR__ . '/vendor/autoload.php';

// Register REST route on REST API init
add_action('rest_api_init', function () {
    register_rest_route('stripe/v1', '/create-checkout-session', [
        'methods' => 'POST',
        'callback' => 'stripe_create_checkout_session',
        'permission_callback' => '__return_true',
    ]);
});

function stripe_create_checkout_session(WP_REST_Request $request) {
    $params = $request->get_json_params();

    if (empty($params['products']) || empty($params['userEmail'])) {
        return new WP_REST_Response(['error' => 'Missing products or userEmail'], 400);
    }

    // Create WooCommerce order
    $order = wc_create_order(['status' => 'pending']);
    if (is_wp_error($order)) {
        return new WP_REST_Response(['error' => 'Failed to create order'], 500);
    }

    foreach ($params['products'] as $product) {
        $product_id = intval($product['id']);
        $qty = intval($product['quantity']) ?: 1;
        $order->add_product(wc_get_product($product_id), $qty);
    }

    $order->set_billing_email(sanitize_email($params['userEmail']));
    $order->calculate_totals();
    $order->save();

    // Get secret key from environment variable
    $stripe_secret = getenv('STRIPE_SECRET_KEY');
    if (!$stripe_secret) {
        return new WP_REST_Response(['error' => 'Stripe secret key not set in environment'], 500);
    }
    \Stripe\Stripe::setApiKey($stripe_secret);

    $line_items = [];
    foreach ($order->get_items() as $item) {
        $product = $item->get_product();
        if (!$product) continue;
        $line_items[] = [
            'price_data' => [
                'currency' => strtolower(get_woocommerce_currency()),
                'product_data' => ['name' => $product->get_name()],
                'unit_amount' => intval($product->get_price() * 100),
            ],
            'quantity' => $item->get_quantity(),
        ];
    }

    try {
        $checkout_session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $line_items,
            'mode' => 'payment',
            'success_url' => home_url('/order-success?session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url' => home_url('/checkout'),
            'metadata' => ['order_id' => $order->get_id()],
            'customer_email' => $order->get_billing_email(),
        ]);
    } catch (Exception $e) {
        return new WP_REST_Response(['error' => $e->getMessage()], 500);
    }

    return rest_ensure_response(['checkout_url' => $checkout_session->url]);
}
