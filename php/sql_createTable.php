<?php
//this file is used to created sql tables
$host = "127.0.0.1";
$dbname = "s2647596_website";
$username = "s2647596";
$password = "Chen@2468jiaxi";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // create the searching table
    $sql = "CREATE TABLE IF NOT EXISTS Searching (
        unique_id VARCHAR(50) PRIMARY KEY,
        file_dir TEXT,
        source_type ENUM('query', 'upload')
    )";
    $pdo->exec($sql);

    echo "connect successfully!";
    // create motif table
    $sql = "CREATE TABLE IF NOT EXISTS Motif (
        motif_id INT AUTO_INCREMENT PRIMARY KEY,
        unique_id VARCHAR(50),
        motif_list TEXT,
        total_seq_num INT,
        motif_seq_num INT,
        motif_zip_dir TEXT,
        FOREIGN KEY (unique_id) REFERENCES Searching(unique_id) ON DELETE CASCADE
    )";
    $pdo->exec($sql);

    // create conservation table
    $sql = "CREATE TABLE IF NOT EXISTS Conservation (
        conservation_id INT AUTO_INCREMENT PRIMARY KEY,
        unique_id VARCHAR(50),
        conservation_plot TEXT,
        conservation_zip_dir TEXT,
        FOREIGN KEY (unique_id) REFERENCES Searching(unique_id) ON DELETE CASCADE
    )";
    $pdo->exec($sql);

    // create tree table
    $sql = "CREATE TABLE IF NOT EXISTS Tree (
        tree_id INT AUTO_INCREMENT PRIMARY KEY,
        unique_id VARCHAR(50),
        tree_file TEXT,
        tree_zip_dir TEXT,
        FOREIGN KEY (unique_id) REFERENCES Searching(unique_id) ON DELETE CASCADE
    )";
    $pdo->exec($sql);

    echo "Tables created successfully!";
} catch (PDOException $e) {
    die("Table creation failed: " . $e->getMessage());
}
