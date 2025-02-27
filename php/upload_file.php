<?php
require_once 'session_init.php';
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
                $_SESSION["uni_id"] = $unique_id;
                $response = [
                    "status" => "success",
                    "message" => "receive the request",
                    "original_name" => $upload_file['name'],
                    "new_name" => $new_file_name,
                    "seq_id" => $_SESSION["uni_id"]
                ];
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
