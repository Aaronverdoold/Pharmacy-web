<?php

function dbconnection() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "apothecare_db";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}

function insertData($email, $password) {
    $conn = dbconnection();

    try {
        // Use prepared statements to prevent SQL injection
        $sql = "INSERT INTO users (email, password) VALUES (:email, :password)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);

        $stmt->execute();

        echo "User registered successfully!";
        header("Location: ../../frontend/home.html");
        exit();
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}

?>
