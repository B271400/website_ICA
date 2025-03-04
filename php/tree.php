<?php
require_once 'session_init.php';
require_once 'db_connect.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_SESSION["uni_id"])){
        //save the uni id
        $uni_id = $_SESSION["uni_id"];

        try {
            // check whether this data exists or not 
            $sql = "SELECT*FROM Tree WHERE unique_id = :unique_id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':unique_id' => "seq_$uni_id"]);
            $searchResult = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if (count($searchResult) > 0) {
                // if this data exists (user search for it before)
                 //return the response directly
                 $response = [
                    "status" => "success",
                    "tree_data_src" => $searchResult["tree_file"] ,
                    "zip_src" => $searchResult["tree_zip_dir"],
                    "tracking_id" =>"seq_$uni_id"
                ];

            } else {
                $tree_file = "./results/seq_$uni_id/seq_tree.aln.treefile";
                $tree_zip_dir = "./results/seq_$uni_id/tree.zip";

                //run python script to do iq-tree
                $python_command = "python3 ../python/tree.py $uni_id";
                exec($python_command, $output, $return_code);
                
                //check the result
                if($return_code == 0){
                    //send the json result from python file to js
                    $output = implode($output);
                    #return the response
                    $response = [
                        "status" => "success",
                        "tree_data_src" => $tree_file,
                        "zip_src" => $tree_zip_dir,
                        "tracking_id" =>"seq_$uni_id"
                    ];
                    
                    // if this data not exists, insert the data
                    $sql = "INSERT INTO Tree (unique_id, tree_file, tree_zip_dir) 
                    VALUES (:unique_id, :tree_file, :tree_zip_dir)";

                    $stmt->execute([
                        ':unique_id' => "seq_$uni_id",
                        ':tree_file' => $tree_file,
                        ':tree_zip_dir' => $tree_zip_dir
                    ]);
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