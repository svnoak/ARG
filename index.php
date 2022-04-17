<?php
require_once("config.php");
include_once("email.php");

/* 
$name = 'Kim';
$password = 1234;

$stmt = $mysqli->prepare("INSERT INTO user (name, password) VALUES(?, ?)");
$stmt->bind_param("si", $name, $password);
$stmt->execute(); */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

$class = $uri[1];
$id = $uri[2];

$className = ucfirst($class);

/* if (class_exists($className) ){

  if( $class && $id ){
    $result = $className::getById($id);
    sendJSON($result);
  } elseif ($class ) {
    sendJSON($className::getAll());
  }
  
} else{
  sendJSON("Bad request", 400);
} */


?>