<?php
include './../database-connect/dbconnect.php';

$conn = dbconnection();

// Hardcoded admin data
$username = "admin";
$email = "admin@example.com";
$password = password_hash("Admin@123", PASSWORD_DEFAULT); // Hash the password
$is_admin = 1;

try {
    $query = "INSERT INTO users (username, email, password, is_admin) 
              VALUES (:username, :email, :password, :is_admin)";
    $stmt = $conn->prepare($query);

    $stmt->execute([
        ':username' => $username,
        ':email' => $email,
        ':password' => $password,
        ':is_admin' => $is_admin
    ]);

    echo "Admin user inserted successfully.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
