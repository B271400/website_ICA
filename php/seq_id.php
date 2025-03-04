<?php
require_once 'session_init.php';
require_once 'db_connect.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //obtain the tracking id
    $tracking_id = isset($_POST["tracking_id"])?$_POST["tracking_id"] :null;

    //determine
    if($tracking_id){
        //search this tracking id in the mysql database
        $searchQuery = $pdo->prepare("SELECT*FROM Searching WHERE unique_id=? ");
        $searchQuery->execute([$tracking_id]);
        $searchResult = $searchQuery->fetchAll(PDO::FETCH_ASSOC);
        //check have result of this id or not
        if(count($searchResult)>0){
            // add this uni id to the session
            $_SESSION["uni_id"] = substr($tracking_id, 4);
            $response = [
                "status" => "success",
                "message" => "find the sequence!",
                "uni_id" => $tracking_id
            ];
        }else{
            $response = [
                "status" => "error",
                "message" => "no sequence record for this ID!",
            ];
        }
    }else{
        $response = [
            "status" => "error",
            "message" => "please enter the id first!",
        ];
    }
}

//return the response
echo json_encode($response);