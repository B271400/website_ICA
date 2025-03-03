<?php
require_once 'session_init.php';
require_once 'db_connect.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_SESSION["uni_id"])){
        //send unique id to python file
        $uni_id = $_SESSION["uni_id"];
        $python_command = "python3 ../python/tree.py $uni_id";
        exec($python_command, $output, $return_code);
        
        //check the result
        if($return_code == 0){
            //send the json result from python file to js
            $output = implode($output);

            try {
                $tree_file = "./results/seq_$uni_id/seq_tree.aln.treefile";
                $tree_zip_dir = "./results/seq_$uni_id/tree.zip";

                // check whether this data exists or not 
                $sql = "SELECT COUNT(*) FROM Tree WHERE unique_id = :unique_id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':unique_id' => "seq_$uni_id"]);
                $exists = $stmt->fetchColumn();
            
                if ($exists) {
                    // if this data exists (user search for it before): update the result, rather than insert it
                    $sql = "UPDATE Tree SET tree_file = :tree_file, tree_zip_dir = :tree_zip_dir 
                            WHERE unique_id = :unique_id";
                } else {
                    // if this data not exists, insert the data
                    $sql = "INSERT INTO Tree (unique_id, tree_file, tree_zip_dir) 
                            VALUES (:unique_id, :tree_file, :tree_zip_dir)";
                }
            
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':unique_id' => "seq_$uni_id",
                    ':tree_file' => $tree_file,
                    ':tree_zip_dir' => $tree_zip_dir
                ]);
            
                $response = [
                    "status" => "success",
                    "tree_data" => $output,
                    "tree_data_src" => $tree_file ,
                    "zip_src" => $tree_zip_dir,
                    "tracking_id" =>"seq_$uni_id"
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