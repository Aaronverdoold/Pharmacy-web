<?php
// signup.php

include './../database-connect/dbconnect.php';  // Include the database connection

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the email and password from the form submission
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Call the insertData function to insert the hashed password into the database
    insertData($email, $password);
}

function insertData($email, $password) {
    $conn = dbconnection();  // Establish the database connection

    try {
        // Hash the password before storing it
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Use prepared statements to prevent SQL injection
        $sql = "INSERT INTO users (email, password) VALUES (:email, :password)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);  // Bind the hashed password

        $stmt->execute();  // Execute the query

        echo "User registered successfully!";
        header("Location: ../../frontend/home.html");  // Redirect to home after successful registration
        exit();
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();  // Handle any errors that occur
    }
}
?>
