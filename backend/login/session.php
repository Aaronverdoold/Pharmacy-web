<?php

session_start();

function logSession( $email, $password)
{
    $_SESSION['email']=$email;
    $_SESSION['password']=$password;
}



?>