<?php
require_once __DIR__ . '/config.php';

header("Cache-Control: no-cache, must-revalidate");
header("Expires: 0");

$id = isset($_GET['id']) ? trim($_GET['id']) : null;

$categories = [
    ["id" => "core", "name" => "امضایی", "label" => "قهوه‌های امضایی آرُست"],
    ["id" => "rotating", "name" => "تک‌خاستگاه · چرخشی", "label" => "تک‌خاستگاه / فصلی چرخشی"]
];

if ($id !== null && $id !== '') {
    foreach ($categories as $cat) {
        if ($cat['id'] === $id) {
            echo json_encode([
                "success" => true,
                "data" => $cat
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Category not found."
    ], JSON_UNESCAPED_UNICODE);
    exit;
} else {
    echo json_encode([
        "success" => true,
        "data" => $categories
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
