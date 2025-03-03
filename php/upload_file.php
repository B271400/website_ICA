<?php
require_once 'session_init.php';
require_once 'db_connect.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // obtain the form data
    $upload_file = isset($_FILES['file_upload']) ? $_FILES['file_upload'] : null;
    if($upload_file){
        $target_dir = "/home/s2647596/public_html/temp/";

        // oobtain the extension of this file
        $file_extension = strtolower(pathinfo($upload_file['name'], PATHINFO_EXTENSION));

        // only allow user upload these files
        $allowed_extensions = ['fasta', 'fa', 'txt'];

        // check the extension
        if (in_array($file_extension, $allowed_extensions)) {
            //change the file name
            $unique_id = bin2hex(random_bytes(4));
            $new_file_name = 'seq_'.$unique_id . '.fasta';
            $target_file = $target_dir . $new_file_name;

            if (move_uploaded_file($upload_file['tmp_name'], $target_file)) {
                //use python to rewrite this temporary file into a result folder
                $_SESSION["uni_id"] = $unique_id;
                $python_command = "python3 ../python/upload_file.py $unique_id";
                exec($python_command, $output, $return_code);

                if($return_code == 0 ){
                    $file_dir = "/home/s2647596/public_html/results/seq_$unique_id/original_seq.fasta";
                    if(file_exists($file_dir) && filesize($file_dir)>0){

                        //save the searching result in database
                        $source_type = "upload";
                        try{
                            $sql = "INSERT INTO Searching (unique_id, file_dir, source_type)
                                    VALUES (:uni_id, :file_dir, :source_type)";
                            $stmt = $pdo->prepare($sql);
                            $stmt->execute([
                                ":uni_id" => "seq_$unique_id",
                                ":file_dir"=>"./results/seq_$unique_id/original_seq.fasta",
                                ":source_type"=>$source_type
                            ]);

                            $response = [
                                "status" => "success",
                                "message" => "receive the request",
                                "original_name" => $upload_file['name'],
                                "new_name" => $new_file_name,
                                "seq_id" => $_SESSION["uni_id"]
                            ];
                        }catch (PDOException $e){
                            $response = [
                                "status" =>"error",
                                "message" => "sql error: $e"
                            ];
                        }
                    }else{
                        $response = [
                            "status"=>"error",
                            "message"=> "the uploaded file is empty!"
                        ];
                    }
                }else{
                    $response = [
                        "status" =>"error",
                        "message" => "fail to save the uploaded file!"
                    ];
                }
            }else{
                $response = [
                    "status" => "error",
                    "message" => "File upload failed!"
                ];
            }
        }else{
            $response = [
                "status" => "error",
                "message" => "invalid file types! Only .fasta, .fa and .txt allowed!"
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
