<?php
require_once('return.php');
require_once("config.php");
include_once("email.php");
include_once("user.php");

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

$table = $uri[2];
$action = $uri[3];

$class = ucfirst($table);

if (class_exists($class) ){

  if( $class == 'Email' ){
    if($_SERVER['REQUEST_METHOD'] == "GET"){
      sendJSON( Email::getAll() );
      exit();
    } else{
      sendJSON( "WRONG METHOD", 403 );
      exit();
    }
  }

  if( $class == 'User' ){
    
    if($_SERVER['REQUEST_METHOD'] == "POST"){

      if( isset($_POST) ){
        $username = $_POST['username'];
        $password = $_POST['password'];

        if( $action == "create" ){
          if( User::exists($username) ){
            sendJSON("User already exists", 409);
            exit();
          }
            $response = User::create($username, $password);
            if( $response ){
              sendJSON( User::get($username, $password)['id'], 201 );
              exit();
            } else{
              sendJSON( "Error creating user", 500 );
            }
            

        } elseif ( $action == "get" ) {
          sendJSON( User::get($username, $password) );
          exit();
        }
        
      } else{
        sendJSON( "WRONG METHOD", 403 );
        exit();
      }
    }
  }

  sendJSON("Bad request", 400);
  exit();
  
} else{
  sendJSON("Bad request", 400);
  exit();
}


?>