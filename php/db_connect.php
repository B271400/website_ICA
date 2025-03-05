<?php
//this file is used to connect the database
$host = "127.0.0.1";
$dbname = "s2647596_website";
$username = "s2647596";
$password = "Chen@2468jiaxi";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch (PDOException $e){
    die("Database connection failed:".$e->getMessage());
}
