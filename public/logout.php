<?php
session_start();
if(isset($_GET['action']) ){
    unset($_SESSION['username']);
    header("Location:login.html");
    exit;
}
?>