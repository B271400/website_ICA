<?php
require_once 'session_init.php';
require_once 'db_connect.php';
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

            try {
                // check whether this data exists or not 
                $sql = "SELECT COUNT(*) FROM Conservation WHERE unique_id = :unique_id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':unique_id' => "seq_$uni_id"]);
                $exists = $stmt->fetchColumn();
            
                if ($exists) {
                    // if this data exists (user search for it before): update the result, rather than insert it
                    $sql = "UPDATE Conservation SET conservation_plot = :conservation_plot, conservation_zip_dir = :conservation_zip_dir 
                            WHERE unique_id = :unique_id";
                } else {
                    // if this data not exists, insert the data
                    $sql = "INSERT INTO Conservation (unique_id, conservation_plot, conservation_zip_dir) 
                            VALUES (:unique_id, :conservation_plot, :conservation_zip_dir)";
                }
            
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':unique_id' => "seq_$uni_id",
                    ':conservation_plot' => $plot_src,
                    ':conservation_zip_dir' => $zip_src
                ]);
            
                $response = [
                    "status" => "success",
                    "message" => "generate the conservation plot",
                    "plot_src" => $plot_src,
                    "zip_src" => $zip_src,
                    "tracking_id" => "seq_$uni_id"
                ];
            } catch (PDOException $e) {
                $response = [
                    "status" =>"error",
                    "message" => "sql error: $e"
                ];
            }   
            
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