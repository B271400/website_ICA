<?php
require_once 'session_init.php';
require_once 'db_connect.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // obtain the form data
    $species_name = isset($_POST['search_species']) ? $_POST['search_species'] : null;
    $protein_name = isset($_POST['search_protein']) ? $_POST['search_protein'] : null;
    //avoid command injection
    $safe_species = escapeshellarg($species_name);
    $safe_protein = escapeshellarg($protein_name);

    if($safe_species && $safe_protein){

        $python_command = "python3 ../python/search.py $safe_species $safe_protein";
        exec($python_command, $output, $return_code);
        $uni_id = implode($output);

        //check the result
        if($return_code == 0 ){
            $file_dir = "./results/seq_$uni_id/original_seq.fasta";
            $abs_file_dir = "/home/s2647596/public_html/results/seq_$uni_id/original_seq.fasta";
            if(file_exists($abs_file_dir) && filesize($abs_file_dir)>0){
                // add this uni id to the session
                $_SESSION["uni_id"] = $uni_id;
                //save the searching result in database
                $source_type = "query";
                try{
                    $sql = "INSERT INTO Searching (unique_id, file_dir, source_type)
                            VALUES (:uni_id, :file_dir, :source_type)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([
                        ":uni_id" => "seq_$uni_id",
                        ":file_dir"=>$file_dir,
                        ":source_type"=>$source_type
                    ]);

                    $response = [
                        "status" => "success",
                        "message" => "obtain the sequence",
                        "uni_id" => $uni_id
                    ];
                }catch (PDOException $e){
                    $response = [
                        "status" =>"error",
                        "message" => "sql error".$e
                    ];
                }
            }else{
                $response = [
                    "status" => "error",
                    "message" => "did not find target sequence"
                ];
            }
        }else{
            $response = [
                "status" => "error",
                "message" => "did not find target sequence",
                "detail" => $return_code
            ];
        }

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