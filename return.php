<?php
function sendJSON($message, $statusCode = "200") {
    header("Content-Type: application/json");
    http_response_code($statusCode);
    $jsonMessage = json_encode($message);
  
    echo($jsonMessage);
  }
?>