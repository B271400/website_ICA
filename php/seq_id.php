<?php
require_once 'session_init.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_SESSION["uni_id"])){
        $response = [
            "status" => "success",
            "message" => "find the previous sequence!",
            "uni_id" => $_SESSION["uni_id"]
        ];
    }else{
        $response = [
            "status" => "error",
            "message" => "no previous sequence! please search it first!",
        ];
    }
}

//return the response
echo json_encode($response);