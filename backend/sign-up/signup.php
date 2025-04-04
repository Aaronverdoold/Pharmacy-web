<?php
include './../database-connect/dbconnect.php';

header('Content-Type: application/json'); // Tell the browser this is JSON

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Basic validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    if (!preg_match('/^[A-Za-z0-9_ ]{3,20}$/', $username)) {
        echo json_encode(['success' => false, 'message' => 'Username must be 3-20 characters and contain only letters, numbers, underscores, or spaces.']);
        exit;
    }

    if (strlen($password) < 8 ||
        !preg_match('/[A-Z]/', $password) ||
        !preg_match('/[a-z]/', $password) ||
        !preg_match('/[0-9]/', $password)) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long and include uppercase, lowercase, and numbers.']);
        exit;
    }

    insertData($username, $email, $password);
}

function insertData($username, $email, $password) {
    $conn = dbconnection();

    try {
        $checkSql = "SELECT COUNT(*) FROM users WHERE email = :email OR username = :username";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->bindParam(':username', $username);
        $checkStmt->execute();

        if ($checkStmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Username or email already taken.']);
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->execute();

        echo json_encode(['success' => true]);
        exit;
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        exit;
    }
}
?>
