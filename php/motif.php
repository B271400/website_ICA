<?php
require_once 'session_init.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_SESSION["uni_id"])){
        //send unique id to python file
        $uni_id = $_SESSION["uni_id"];
        $python_command = "python3 ../python/motif.py $uni_id";
        exec($python_command, $output, $return_code);
        
        //check the result
        if($return_code == 0){
            //send the json result from python file to js
            $json_str = implode("\n",$output);
            echo $json_str;
            
        }else{
            $response = [
                "status" => "error",
                "message" => "python script error",
                "output" => $output,
                "return code"=>$return_code
            ];
            //return the response
            echo json_encode($response);
        }


    }else{
        $response = [
            "status" => "error",
            "message" => "did not obtain sequence id",
        ];
        //return the response
        echo json_encode($response);
    }
}else{
    $response = [
        "status" => "error",
        "message" => "invalid request method"
    ];
    //return the response
    echo json_encode($response);
}

