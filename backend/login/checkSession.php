<?php
require_once 'session.php';

// Start session
if (isLoggedIn()) {
    echo json_encode([
        'loggedIn' => true,
        'username' => getCurrentUsername()
    ]);
} else {
    echo json_encode([
        'loggedIn' => false
    ]);
}
?>