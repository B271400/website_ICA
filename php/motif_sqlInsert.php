<?php
require_once 'db_connect.php';
header("Content-Type: application/json");

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // unique_id: data.uniq_id,  // the unique id 
    // motif_list:Object.keys(data.motif_dict).join(";"), //combine motifs into 1 string
    // total_seq_num: data.total_seq,  // total number of sequences.
    // motif_seq_num: data.motif_seq,  // number of sequence with motif
    // motif_zip_dir: data.zip_src
    if(isset($_POST["uni_id"])){
        $uni_id = $_POST["uni_id"];
        $motif_list = $_POST["motif_list"];
        $total_seq_num = $_POST["total_seq_num"];
        $motif_seq_num = $_POST["motif_seq_num"];
        $motif_zip_dir = $_POST["motif_zip_dir"];

        try {
            // check whether this data exists or not 
            $sql = "SELECT COUNT(*) FROM Motif WHERE unique_id = :unique_id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':unique_id' => "seq_$uni_id"]);
            $exists = $stmt->fetchColumn();
        
            if ($exists) {
                // if this data exists (user search for it before): update the result, rather than insert it
                $sql = "UPDATE Motif SET motif_list = :motif_list, total_seq_num = :total_seq_num , motif_seq_num = :motif_seq_num, motif_zip_dir = :motif_zip_dir
                        WHERE unique_id = :unique_id";
            } else {
                // if this data not exists, insert the data
                $sql = "INSERT INTO Motif (unique_id, motif_list, total_seq_num, motif_seq_num, motif_zip_dir) 
                        VALUES (:unique_id, :motif_list, :total_seq_num, :motif_seq_num, :motif_zip_dir)";
            }
        
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ":unique_id" => "seq_$uni_id" ,
                ":motif_list" => $motif_list,
                ":total_seq_num" => $total_seq_num,
                ":motif_seq_num" => $motif_seq_num,
                ":motif_zip_dir" => $motif_zip_dir
            ]);

            $response = [
                "status" =>"success",
                "message" => "save data into database"
            ];
        }catch (PDOException $e) {
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