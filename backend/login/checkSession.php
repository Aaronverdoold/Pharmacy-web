<?php
require_once 'session.php';

// Start session
if (isLoggedIn()) {
    echo json_encode([
        'loggedIn' => true,
        'email' => getCurrentUser()
    ]);
} else {
    echo json_encode([
        'loggedIn' => false
    ]);
}
?>