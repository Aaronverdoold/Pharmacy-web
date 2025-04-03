<?php
require_once 'session.php';

// Log the user out
logout();

// Redirect to home page
header('Location: /Pharmacy-web/frontend/home-page/home.html');
exit();
?>