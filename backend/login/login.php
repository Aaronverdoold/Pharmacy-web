<?php

include './../database-connect/dbconnect.php';
include 'session.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate the email and password
    if (checkUser($email, $password)) {
        echo "Login successful!";
        header("Location: ../../frontend/home-page/home.html");
        exit();
    } else {
        echo "Invalid email or password.";
    }
}

// Function to check if the user exists and verify the password
function checkUser($email, $password) {
    $conn = dbconnection();

    $query = "SELECT * FROM users WHERE email = :email";
    $stmt = $conn->prepare($query);

    try {
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Check if user exists
        if (!$user) {
            echo "No user found with this email.<br>";
            return false;
        }

        // Verify the password
        if (password_verify($password, $user["password"])) {
            logSession($user["email"]);
            return true;
        } else {
            // If password doesn't match, return false
            echo "Incorrect password.<br>";
            return false;
        }
    } catch (PDOException $e) {
        echo 'Error: ' . $e->getMessage();
    }

    return false;
}
?>
