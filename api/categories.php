<?php
require_once __DIR__ . '/config.php';

// Prevent caching for dynamic API responses
header("Cache-Control: no-cache, must-revalidate");
header("Expires: 0");

try {
    $pdo = get_db_connection();

    $tablesStmt = $pdo->query("SHOW TABLES");
    $tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

    $catTable = find_categories_table($tables);
    $categories = [];

    if ($catTable) {
        $colsStmt = $pdo->query("DESCRIBE " . $catTable);
        $columns = $colsStmt->fetchAll(PDO::FETCH_COLUMN);

        $orderSql = in_array('id', $columns) ? " ORDER BY id ASC" : "";
        $stmt = $pdo->prepare("SELECT * FROM " . $catTable . $orderSql);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        foreach ($rows as $row) {
            $categories[] = format_category($row);
        }
    } else {
        // If categories are stored in products table, query distinct categories from database
        $prodTable = find_products_table($tables);
        if ($prodTable) {
            $colsStmt = $pdo->query("DESCRIBE " . $prodTable);
            $columns = $colsStmt->fetchAll(PDO::FETCH_COLUMN);

            if (in_array('category', $columns)) {
                $labelCol = in_array('cat_label', $columns) ? ', cat_label' : (in_array('catLabel', $columns) ? ', catLabel' : '');
                $stmt = $pdo->prepare("SELECT DISTINCT category" . $labelCol . " FROM " . $prodTable . " WHERE category IS NOT NULL AND category != ''");
                $stmt->execute();
                $rows = $stmt->fetchAll();

                foreach ($rows as $row) {
                    $id = strval($row['category']);
                    $labelVal = isset($row['cat_label']) ? $row['cat_label'] : (isset($row['catLabel']) ? $row['catLabel'] : ($id === 'core' ? 'قهوه‌های امضایی آرُست' : 'تک‌خاستگاه / فصلی چرخشی'));
                    $nameVal = ($id === 'core') ? 'امضایی' : 'تک‌خاستگاه · چرخشی';
                    $categories[] = [
                        "id" => $id,
                        "name" => $nameVal,
                        "label" => strval($labelVal)
                    ];
                }
            }
        }
    }

    if (empty($categories)) {
        $categories = [
            ["id" => "core", "name" => "امضایی", "label" => "قهوه‌های امضایی آرُست"],
            ["id" => "rotating", "name" => "تک‌خاستگاه · چرخشی", "label" => "تک‌خاستگاه / فصلی چرخشی"]
        ];
    }

    $id = isset($_GET['id']) ? trim($_GET['id']) : null;

    if ($id !== null && $id !== '') {
        foreach ($categories as $cat) {
            if (strval($cat['id']) === $id) {
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

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "An error occurred while fetching category data."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function find_categories_table($tables) {
    $candidates = ['categories', 'category', 'coffee_categories', 'product_categories', 'cats'];
    foreach ($candidates as $candidate) {
        if (in_array($candidate, $tables)) {
            return $candidate;
        }
    }
    foreach ($tables as $t) {
        $tl = strtolower($t);
        if ($tl === 'categories' || $tl === 'category' || strpos($tl, 'categor') !== false) {
            return $t;
        }
    }
    return null;
}

function find_products_table($tables) {
    $candidates = ['products', 'product', 'coffee_products', 'aroast_products', 'app_products', 'tbl_products', 'items', 'coffee'];
    foreach ($candidates as $candidate) {
        if (in_array($candidate, $tables)) {
            return $candidate;
        }
    }
    foreach ($tables as $t) {
        $tl = strtolower($t);
        if (strpos($tl, 'product') !== false || strpos($tl, 'coffee') !== false || strpos($tl, 'item') !== false) {
            return $t;
        }
    }
    return null;
}

function format_category($row) {
    $id = strval(isset($row['slug']) ? $row['slug'] : (isset($row['code']) ? $row['code'] : (isset($row['id']) ? $row['id'] : '')));
    $name = strval(isset($row['name']) ? $row['name'] : (isset($row['title']) ? $row['title'] : ''));
    $label = strval(isset($row['label']) ? $row['label'] : (isset($row['description']) ? $row['description'] : (isset($row['name']) ? $row['name'] : '')));

    return [
        "id" => $id,
        "name" => $name,
        "label" => $label
    ];
}
