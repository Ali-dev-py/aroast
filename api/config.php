<?php
// Secure database and CORS configuration for A-Roast API

// Narrowly scoped CORS policy (no wildcard * in production)
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed_origins = [
    'https://app.aprojects.ir',
    'http://app.aprojects.ir',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
} else {
    header("Access-Control-Allow-Origin: https://app.aprojects.ir");
}

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load local secret configuration if exists (never committed to Git)
$local_config = __DIR__ . '/config.local.php';
if (file_exists($local_config)) {
    require_once $local_config;
}

// Database Connection Constants (fallback to environment variables)
if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: 'aproject_app');
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: 'aproject_app_user');
if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS') ?: '');

function get_db_connection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (Exception $e) {
        // Never expose raw database credentials or internal errors to client
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Database connection error."
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
