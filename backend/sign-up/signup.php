<?php

include './../database-connect/dbconnect.php';

$email = $_POST['email'];
$password = $_POST['password'];

insertData($email, $password);

?>
