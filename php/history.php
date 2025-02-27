<?php
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // obtain the form data
    $seq_id = isset($_POST['seq_id']) ? $_POST['seq_id'] : null;

    if($seq_id){
        $response = [
            "status" => "success",
            "message" => "receive the request",
            "file_name" => "target_seq"
        ];
    }else{
        $response = [
            "status" => "error",
            "message" => "invalid input request"
        ];
    }
} else {
    $response = [
        "status" => "error",
        "message" => "Invalid request method"
    ];
}
//return the response
echo json_encode($response);

?>