<?php
// Start session
session_start();

// Function to log user in
function logSession($email) {
    $_SESSION['user_email'] = $email;
    $_SESSION['logged_in'] = true;
    $_SESSION['last_activity'] = time();
}

// Function to check if user is logged in
function isLoggedIn() {
    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
        // Check session timeout
        if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
            // Session has expired
            session_unset();
            session_destroy();
            return false;
        }
        // Updates last activity time of the user
        $_SESSION['last_activity'] = time();
        return true;
    }
    return false;
}

// Function to log user out
function logout() {
    $_SESSION = array();
    session_destroy();
}

// Function to get current user email
function getCurrentUser() {
    if (isLoggedIn()) {
        return $_SESSION['user_email'];
    }
    return null;
}

?>