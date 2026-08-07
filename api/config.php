<?php
// Secure database and CORS configuration for A-Roast API
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$local_config = __DIR__ . '/config.local.php';
if (file_exists($local_config)) {
    require_once $local_config;
}

function get_env_credential($keys, $default = '') {
    foreach ($keys as $key) {
        if (isset($_ENV[$key]) && $_ENV[$key] !== '') return $_ENV[$key];
        if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') return $_SERVER[$key];
        $val = getenv($key);
        if ($val !== false && $val !== '') return $val;
        if (function_exists('apache_getenv')) {
            $val = apache_getenv($key);
            if ($val !== false && $val !== '') return $val;
        }
    }
    return $default;
}

if (!defined('DB_HOST')) define('DB_HOST', get_env_credential(['DB_HOST', 'DATABASE_HOST', 'MYSQL_HOST'], 'localhost'));
if (!defined('DB_NAME')) define('DB_NAME', get_env_credential(['DB_NAME', 'DATABASE_NAME', 'MYSQL_DATABASE', 'MYSQL_DB'], 'aproject_app'));
if (!defined('DB_USER')) define('DB_USER', get_env_credential(['DB_USER', 'DATABASE_USER', 'MYSQL_USER', 'MYSQL_USERNAME'], 'aproject_app_user'));
if (!defined('DB_PASS')) define('DB_PASS', get_env_credential(['DB_PASS', 'DB_PASSWORD', 'DATABASE_PASSWORD', 'MYSQL_PASSWORD', 'MYSQL_PWD'], '4Y?c)KQt+#Jw&$%!'));

function get_db_connection() {
    static $cached_pdo = null;
    if ($cached_pdo !== null) {
        return $cached_pdo;
    }

    $hosts = [DB_HOST];
    if (DB_HOST === 'localhost') {
        $hosts[] = '127.0.0.1';
    } elseif (DB_HOST === '127.0.0.1') {
        $hosts[] = 'localhost';
    }

    $db_names = array_unique([
        DB_NAME,
        'aproject_app',
        'aprojects_app',
        'aproject_aroast',
        'aproject_db'
    ]);

    $users = array_unique([
        DB_USER,
        'aproject_app_user',
        'aproject_appuser',
        'aproject_app',
        'aproject_user',
        'aproject'
    ]);

    foreach ($hosts as $h) {
        foreach ($db_names as $db) {
            foreach ($users as $u) {
                try {
                    $dsn = "mysql:host=" . $h . ";dbname=" . $db . ";charset=utf8mb4";
                    $pdo = new PDO($dsn, $u, DB_PASS, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false
                    ]);
                    $cached_pdo = $pdo;
                    return $pdo;
                } catch (Exception $e) {
                    // try next combination
                }
            }
        }
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection error."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
