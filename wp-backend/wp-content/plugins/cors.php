  GNU nano 4.8                                                                            cors.php                                                                                      
<?php
add_action('init', function () {
    $origin = getenv('WORDPRESS_SITE_URL') ?: 'https://api.lifeisnatural.eu';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce");
    header("Access-Control-Allow-Credentials: true");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit;
    }
});

add_filter('rest_pre_dispatch_request', function ($result, $server, $request) {
    $origin = getenv('WORDPRESS_SITE_URL') ?: 'https://api.lifeisnatural.eu';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce");
    header("Access-Control-Allow-Credentials: true");
    return $result;
}, 10, 3);
