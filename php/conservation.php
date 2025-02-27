<?php
require_once 'session_init.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_SESSION["uni_id"])){
        //send unique id to python file
        $uni_id = $_SESSION["uni_id"];
        $python_command = "python3 ../python/conservation.py $uni_id";
        exec($python_command, $output, $return_code);
        $output = implode($output);

        //check the result
        if($return_code == 0){
            $plot_src = "./results/seq_$uni_id/plotcon.1.png";
            $zip_src = "./results/seq_$uni_id/conservation.zip";

            $response = [
                "status" => "success",
                "message" => "generate the conservation plot",
                "plot_src" => $plot_src,
                "zip_src" => $zip_src,
            ];
        }else{
            $response = [
                "status" => "error",
                "message" => "python script error",
                "output" => $output,
                "return code"=>$return_code
            ];
        }


    }else{
        $response = [
            "status" => "error",
            "message" => "did not obtain sequence id",
        ];
    }
}else{
    $response = [
        "status" => "error",
        "message" => "invalid request method"
    ];
}

//return the response
echo json_encode($response);