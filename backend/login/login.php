<?php
include './../database-connect/dbconnect.php';
include 'session.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
        exit();
    }

    $conn = dbconnection();

    $query = "SELECT * FROM users WHERE email = :email";
    $stmt = $conn->prepare($query);

    try {
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'No user found with this email.']);
            exit();
        }

        if (!password_verify($password, $user["password"])) {
            echo json_encode(['success' => false, 'message' => 'Incorrect password.']);
            exit();
        }

        // Log the session
        logSession($user["username"], $user["email"]);

        // Redirect depending on user role
        if ($user["is_admin"] == 1) {
            echo json_encode([
                'success' => true,
                'role' => 'admin',
                'redirect' => '../../frontend/dashboard/dashboard.html'
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'role' => 'user',
                'redirect' => '../../frontend/home-page/home.html'
            ]);
        }
        exit();

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Server error.']);
        exit();
    }
}
?>
