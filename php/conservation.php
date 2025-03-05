<?php
require_once 'session_init.php';
require_once 'db_connect.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_SESSION["uni_id"])){
        //save the uni id
        $uni_id = $_SESSION["uni_id"];

        //check whether this data exists or not
        try {
            // check whether this data exists or not 
            $sql = "SELECT*FROM Conservation WHERE unique_id = :unique_id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':unique_id' => "seq_$uni_id"]);
            $searchResult = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
            if (count($searchResult) > 0) {
                // if this data exists (user search for it before)
                $firstResult = $searchResult[0];
                //return the resposne directly
                $response = [
                    "status" => "success",
                    "message" => "generate the conservation plot",
                    "plot_src" => $firstResult["conservation_plot"],
                    "zip_src" => $firstResult["conservation_zip_dir"],
                    "tracking_id" => "seq_$uni_id"
                ];

            } else {
                //if this data not exists, obtain the results from python script
                $python_command = "python3 ../python/conservation.py $uni_id";
                exec($python_command, $output, $return_code);
                $output = implode($output);

                 //check the result from python
                if($return_code == 0){
                    $plot_src = "./results/seq_$uni_id/plotcon.1.png";
                    $zip_src = "./results/seq_$uni_id/conservation.zip";

                    // if this data not exists, insert the data
                    $sql = "INSERT INTO Conservation (unique_id, conservation_plot, conservation_zip_dir) 
                            VALUES (:unique_id, :conservation_plot, :conservation_zip_dir)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([
                        ':unique_id' => "seq_$uni_id",
                        ':conservation_plot' => $plot_src,
                        ':conservation_zip_dir' => $zip_src
                    ]);
                
                    //return the result
                    $response = [
                        "status" => "success",
                        "message" => "generate the conservation plot",
                        "plot_src" => $plot_src,
                        "zip_src" => $zip_src,
                        "tracking_id" => "seq_$uni_id"
                    ];
                    
                }else{
                    $response = [
                        "status" => "error",
                        "message" => "python script error",
                        "output" => $output,
                        "return code"=>$return_code
                    ];
                }
                
            }
        
        } catch (PDOException $e) {
            $response = [
                "status" =>"error",
                "message" => "sql error: $e"
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