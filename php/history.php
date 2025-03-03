<?php
require_once 'db_connect.php';
header("Content-Type: application/json");

//array for results
$searchResult = $motifResults = $conservationResults = $treeResults =[];

// use post method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // obtain the form data
    $tracking_id = isset($_POST['tracking_id']) ? $_POST['tracking_id'] : null;

    if($tracking_id){
        //searching the record of this tracking id
        $searchQuery = $pdo->prepare("SELECT*FROM Searching WHERE unique_id=? ");
        $searchQuery->execute([$tracking_id]);
        $searchResult = $searchQuery->fetchAll(PDO::FETCH_ASSOC);

        //check have result or not
        if(count($searchResult) > 0){
            //search other 3 tables
            $motifQuery = $pdo->prepare("SELECT * FROM Motif WHERE unique_id = ?");
            $conservationQuery = $pdo->prepare("SELECT * FROM Conservation WHERE unique_id = ?");
            $treeQuery = $pdo->prepare("SELECT * FROM Tree WHERE unique_id = ?");

            $motifQuery->execute([$tracking_id]);
            $conservationQuery->execute([$tracking_id]);
            $treeQuery->execute([$tracking_id]);

            $motifResults = $motifQuery->fetchAll(PDO::FETCH_ASSOC);
            $conservationResults = $conservationQuery->fetchAll(PDO::FETCH_ASSOC);
            $treeResults = $treeQuery->fetchAll(PDO::FETCH_ASSOC);

            //check have result from analysis tables or not
            if(count($motifResults)>0 ||count($conservationResults)>0 || count($treeResults)>0){
                $response = [
                    "status" => "success",
                    "analysis_type" => "has_analysis",
                    "search_result" => $searchResult,
                    "motif_result" => count($motifResults)>0 ? $motifResults : "",
                    "conservation_result" => count($conservationResults)>0 ? $conservationResults : "",
                    "tree_result" => count($treeResults)>0 ? $treeResults : ""
                ];

            }else{

                // return sequence searching result
                $response = [
                    "status" => "success",
                    "analysis_type" => "no_analysis",
                    "search_result" => $searchResult
                ];
            }


        }else{
            $response = [
                "status" => "error",
                "message" => "no records for this tracking id!"
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

?>