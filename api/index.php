<?php
require_once __DIR__ . '/config.php';

header("Cache-Control: no-cache, must-revalidate");
header("Expires: 0");

echo json_encode([
    "success" => true,
    "message" => "A-Roast REST API ready.",
    "endpoints" => [
        "/api/products",
        "/api/products/{id}",
        "/api/categories",
        "/api/categories/{id}"
    ]
], JSON_UNESCAPED_UNICODE);
