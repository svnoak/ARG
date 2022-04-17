<?php
require_once("config.php");
include_once("email.php");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  // Tillåt alla (origins) och alla headers
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: *");
  exit();
}
header("Access-Control-Allow-Origin: *");

/* 
$name = 'Kim';
$password = 1234;

$stmt = $mysqli->prepare("INSERT INTO user (name, password) VALUES(?, ?)");
$stmt->bind_param("si", $name, $password);
$stmt->execute(); */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

$class = $uri[2];
$id = $uri[3];

$className = ucfirst($class);

if (class_exists($className) ){

  if( $class && $id ){
    $result = $className::getById($id);
    sendJSON($result);
  } elseif ($class ) {
    sendJSON($className::getAll());
  }
  
} else{
  sendJSON("Bad request", 400);
}


?>