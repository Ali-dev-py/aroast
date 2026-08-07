<?php
require_once __DIR__ . '/config.php';

// Prevent caching for dynamic API responses
header("Cache-Control: no-cache, must-revalidate");
header("Expires: 0");

try {
    $pdo = get_db_connection();

    // Query tables in current schema to adapt to normalized or JSON structures
    $tablesStmt = $pdo->query("SHOW TABLES");
    $tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('products', $tables)) {
        throw new Exception("Products table not found.");
    }

    $id = isset($_GET['id']) ? trim($_GET['id']) : null;

    if ($id !== null && $id !== '') {
        // Fetch single product by id or slug
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? OR slug = ? LIMIT 1");
        $stmt->execute([$id, $id]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Product not found."
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $data = format_product($pdo, $row, $tables);
        echo json_encode([
            "success" => true,
            "data" => $data
        ], JSON_UNESCAPED_UNICODE);
        exit;
    } else {
        // Fetch all products
        $stmt = $pdo->prepare("SELECT * FROM products ORDER BY id ASC");
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $data = [];
        foreach ($rows as $row) {
            $data[] = format_product($pdo, $row, $tables);
        }

        echo json_encode([
            "success" => true,
            "data" => $data
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "An error occurred while fetching product data."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function format_product($pdo, $row, $tables) {
    // Determine product slug / ID
    $id = strval(isset($row['slug']) ? $row['slug'] : (isset($row['code']) ? $row['code'] : $row['id']));
    $sku = strval(isset($row['sku']) ? $row['sku'] : '');
    $name = strval(isset($row['name']) ? $row['name'] : '');
    $nameEn = strval(isset($row['name_en']) ? $row['name_en'] : (isset($row['nameEn']) ? $row['nameEn'] : ''));
    $tasteLine = strval(isset($row['taste_line']) ? $row['taste_line'] : (isset($row['tasteLine']) ? $row['tasteLine'] : ''));
    $character = strval(isset($row['character_label']) ? $row['character_label'] : (isset($row['character']) ? $row['character'] : ''));
    $category = strval(isset($row['category']) ? $row['category'] : 'core');
    $catLabel = strval(isset($row['cat_label']) ? $row['cat_label'] : (isset($row['catLabel']) ? $row['catLabel'] : 'امضایی'));
    $roastLabel = strval(isset($row['roast_label']) ? $row['roast_label'] : (isset($row['roastLabel']) ? $row['roastLabel'] : 'مدیوم'));
    $origin = strval(isset($row['origin']) ? $row['origin'] : '');
    $process = strval(isset($row['process']) ? $row['process'] : '');

    // Determine ratio
    $ratio = ["arabica" => 100, "robusta" => 0];
    if (isset($row['ratio']) && is_string($row['ratio']) && substr(trim($row['ratio']), 0, 1) === '{') {
        $decoded = json_decode($row['ratio'], true);
        if ($decoded) $ratio = $decoded;
    } elseif (isset($row['ratio_arabica']) && isset($row['ratio_robusta'])) {
        $ratio = [
            "arabica" => intval($row['ratio_arabica']),
            "robusta" => intval($row['ratio_robusta'])
        ];
    }

    // Integers
    $roast = isset($row['roast']) ? intval($row['roast']) : 3;
    $acidity = isset($row['acidity']) ? intval($row['acidity']) : 3;
    $body = isset($row['body']) ? intval($row['body']) : 3;
    $sweetness = isset($row['sweetness']) ? intval($row['sweetness']) : 3;
    $caffeine = isset($row['caffeine']) ? intval($row['caffeine']) : 3;

    // Notes
    $notes = [];
    if (isset($row['notes']) && is_string($row['notes'])) {
        $t = trim($row['notes']);
        if (substr($t, 0, 1) === '[') {
            $notes = json_decode($row['notes'], true) ?: [];
        } else {
            $notes = array_map('trim', explode(',', $row['notes']));
        }
    } elseif (in_array('product_notes', $tables)) {
        $stmt = $pdo->prepare("SELECT note FROM product_notes WHERE product_id = ? OR slug = ?");
        $stmt->execute([$row['id'], $id]);
        $notes = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // Brews
    $brews = [];
    if (isset($row['brews']) && is_string($row['brews'])) {
        $t = trim($row['brews']);
        if (substr($t, 0, 1) === '[') {
            $brews = json_decode($row['brews'], true) ?: [];
        } else {
            $brews = array_map('trim', explode(',', $row['brews']));
        }
    } elseif (in_array('product_brews', $tables)) {
        $stmt = $pdo->prepare("SELECT brew FROM product_brews WHERE product_id = ? OR slug = ?");
        $stmt->execute([$row['id'], $id]);
        $brews = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // Sizes
    $sizes = [];
    if (isset($row['sizes']) && is_string($row['sizes']) && substr(trim($row['sizes']), 0, 1) === '[') {
        $sizes = json_decode($row['sizes'], true) ?: [];
    } elseif (in_array('product_sizes', $tables)) {
        $stmt = $pdo->prepare("SELECT g, price FROM product_sizes WHERE product_id = ? OR slug = ? ORDER BY g ASC");
        $stmt->execute([$row['id'], $id]);
        $res = $stmt->fetchAll();
        foreach ($res as $sr) {
            $sizes[] = ["g" => intval($sr['g']), "price" => intval($sr['price'])];
        }
    } elseif (in_array('sizes', $tables)) {
        $stmt = $pdo->prepare("SELECT g, price FROM sizes WHERE product_id = ? OR slug = ? ORDER BY g ASC");
        $stmt->execute([$row['id'], $id]);
        $res = $stmt->fetchAll();
        foreach ($res as $sr) {
            $sizes[] = ["g" => intval($sr['g']), "price" => intval($sr['price'])];
        }
    }

    $grindException = isset($row['grind_exception']) ? boolval($row['grind_exception']) : (isset($row['grindException']) ? boolval($row['grindException']) : false);
    $tagline = strval(isset($row['tagline']) ? $row['tagline'] : '');
    $desc = strval(isset($row['description']) ? $row['description'] : (isset($row['desc']) ? $row['desc'] : ''));
    $badge = (isset($row['badge']) && $row['badge'] !== null && $row['badge'] !== '') ? strval($row['badge']) : null;

    return [
        "id" => $id,
        "sku" => $sku,
        "name" => $name,
        "nameEn" => $nameEn,
        "tasteLine" => $tasteLine,
        "character" => $character,
        "category" => $category,
        "catLabel" => $catLabel,
        "ratio" => $ratio,
        "roastLabel" => $roastLabel,
        "origin" => $origin,
        "process" => $process,
        "roast" => $roast,
        "acidity" => $acidity,
        "body" => $body,
        "sweetness" => $sweetness,
        "caffeine" => $caffeine,
        "notes" => $notes,
        "brews" => $brews,
        "grindException" => $grindException,
        "tagline" => $tagline,
        "desc" => $desc,
        "sizes" => $sizes,
        "badge" => $badge
    ];
}
