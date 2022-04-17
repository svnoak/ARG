<?php
// Basic connection settings
$databaseHost = 'localhost';
$databaseUsername = 'varg';
$databasePassword = 'q3FMeGyWwfMnHzt4BKW9HEKfTeUAWeFMFcUacxs3SMFqkZwZE4kLHeUvfeAKbZxD';
$databaseName = 'varg';

// Connect to the database
$mysqli = mysqli_connect($databaseHost, $databaseUsername, $databasePassword, $databaseName); 

function sendJSON($message, $statusCode = "200") {
    header("Content-Type: application/json");
    http_response_code($statusCode);
    $jsonMessage = json_encode($message);
  
    echo($jsonMessage);
  }
?>