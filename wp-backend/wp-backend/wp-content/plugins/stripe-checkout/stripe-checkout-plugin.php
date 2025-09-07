<?php
/*
Plugin Name: Stripe Checkout Plugin
Description: Adds Stripe checkout session REST endpoint with WooCommerce integration.
Version: 2.0
Author: Alparslan
*/

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/vendor/autoload.php';

/**
 * Toggle this to true if you want the endpoint accessible only to logged-in users
 */
define('STRIPE_ENDPOINT_LOGGED_IN_ONLY', false);

/**
 * Register REST API routes
 */
add_action('rest_api_init', function () {
    // Create checkout session
    register_rest_route('stripe/v1', '/create-checkout-session', [
        'methods' => 'POST',
        'callback' => 'stripe_create_checkout_session',
        'permission_callback' => function () {
            return STRIPE_ENDPOINT_LOGGED_IN_ONLY ? is_user_logged_in() : true;
        },
    ]);

    // Retrieve checkout session
    register_rest_route('stripe/v1', '/checkout-session/(?P<id>[^/]+)', [
        'methods' => 'GET',
        'callback' => 'stripe_get_checkout_session',
        'permission_callback' => function () {
            return STRIPE_ENDPOINT_LOGGED_IN_ONLY ? is_user_logged_in() : true;
        },
    ]);

    // Stripe webhook
    register_rest_route('stripe/v1', '/webhook', [
        'methods' => 'POST',
        'callback' => 'stripe_webhook_handler',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Create a Stripe checkout session
 */
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
        $wc_product = wc_get_product($product_id);
        if ($wc_product) {
            $order->add_product($wc_product, $qty);
        }
    }

    $order->set_billing_email(sanitize_email($params['userEmail']));
    $order->calculate_totals();
    $order->save();

    // Stripe secret from environment
    $stripe_secret = getenv('STRIPE_SECRET_KEY');
    if (!$stripe_secret) {
        return new WP_REST_Response(['error' => 'Stripe secret key not set'], 500);
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

    if (empty($line_items)) {
        return new WP_REST_Response(['error' => 'No valid products to checkout'], 400);
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

            // Collect billing + shipping addresses
            'billing_address_collection' => 'required',
            'shipping_address_collection' => [
                'allowed_countries' => [
                    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR',
                    'HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK',
                    'SI','ES','SE'
                ],
            ],
        ]);
    } catch (Exception $e) {
        return new WP_REST_Response(['error' => $e->getMessage()], 500);
    }

    // Return URL for frontend
    return rest_ensure_response(['url' => $checkout_session->url]);
}

/**
 * Retrieve a Stripe checkout session
 */
function stripe_get_checkout_session(WP_REST_Request $request) {
    $session_id = $request['id'];

    $stripe_secret = getenv('STRIPE_SECRET_KEY');
    if (!$stripe_secret) {
        return new WP_REST_Response(['error' => 'Stripe secret key not set'], 500);
    }

    \Stripe\Stripe::setApiKey($stripe_secret);

    try {
        $session = \Stripe\Checkout\Session::retrieve($session_id);
        return rest_ensure_response($session);
    } catch (Exception $e) {
        return new WP_REST_Response(['error' => $e->getMessage()], 500);
    }
}

/**
 * Handle Stripe webhook events
 */
function stripe_webhook_handler(WP_REST_Request $request) {
    $payload = $request->get_body();
    $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
    $secret = getenv('STRIPE_WEBHOOK_SECRET');

    if (!$secret) {
        return new WP_REST_Response(['error' => 'Webhook secret not set'], 500);
    }

    try {
        $event = \Stripe\Webhook::constructEvent(
            $payload, $sig_header, $secret
        );
    } catch (\UnexpectedValueException $e) {
        return new WP_REST_Response(['error' => 'Invalid payload'], 400);
    } catch (\Stripe\Exception\SignatureVerificationException $e) {
        return new WP_REST_Response(['error' => 'Invalid signature'], 400);
    }

    if ($event->type === 'checkout.session.completed') {
        $session = $event->data->object;
        $order_id = $session->metadata->order_id ?? null;

        if ($order_id) {
            $order = wc_get_order($order_id);
            if ($order) {
                // Mark payment complete
                $order->payment_complete($session->payment_intent);

                // Update billing + shipping details
                if (!empty($session->customer_details)) {
                    $details = $session->customer_details;

                    $order->set_billing_first_name($details->name ?? '');
                    $order->set_billing_email($details->email ?? '');
                    $order->set_billing_phone($details->phone ?? '');

                    if (!empty($details->address)) {
                        $addr = $details->address;
                        $order->set_billing_address_1($addr->line1 ?? '');
                        $order->set_billing_address_2($addr->line2 ?? '');
                        $order->set_billing_city($addr->city ?? '');
                        $order->set_billing_postcode($addr->postal_code ?? '');
                        $order->set_billing_country($addr->country ?? '');
                    }

                    if (!empty($session->shipping_details)) {
                        $ship = $session->shipping_details;
                        $order->set_shipping_first_name($ship->name ?? '');
                        if (!empty($ship->address)) {
                            $saddr = $ship->address;
                            $order->set_shipping_address_1($saddr->line1 ?? '');
                            $order->set_shipping_address_2($saddr->line2 ?? '');
                            $order->set_shipping_city($saddr->city ?? '');
                            $order->set_shipping_postcode($saddr->postal_code ?? '');
                            $order->set_shipping_country($saddr->country ?? '');
                        }
                    }
                }

                // Set order status completed
                $order->update_status('completed', 'Stripe payment confirmed via webhook');
                $order->save();
            }
        }
    }

    return new WP_REST_Response(['status' => 'success'], 200);
}
