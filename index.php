<?php
require_once("return.php");
require_once("config.php");
include_once("email.php");
include_once("user.php");
include_once("place.php");
include_once("dialog.php");
include_once("puzzle.php");
include_once("npc.php");

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
$arg_1 = $uri[3];
$arg_2 = $uri[4];

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

  if( $class == 'Place' ){
    if($_SERVER['REQUEST_METHOD'] == "GET"){
      sendJSON( Place::getAll() );
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

        if( $arg_1 == "create" ){
          if( User::exists($username) ){
            sendJSON("User already exists", 409);
            exit();
          }
            $response = User::create($username, $password);
            if( $response ){
              sendJSON( User::get($username, $password), 201 );
              exit();
            } else{
              sendJSON( "Error creating user", 500 );
            }
            

        } elseif ( $arg_1 == "get" ) {
          sendJSON( User::get($username, $password) );
          exit();
        }
        
      } else{
        sendJSON( "WRONG METHOD", 403 );
        exit();
      }
    }
  }

  if( $class == 'Npc' ){
    if($_SERVER['REQUEST_METHOD'] == "GET"){
      if( isset($arg_1) ){
        if(is_numeric($arg_1)) {
          sendJSON( Npc::getById($arg_1) );
          exit();
      } else {
        sendJSON( "Bad Request", 400);
        exit();
        }
      } else {
        sendJSON( Npc::getAll() );
        exit();
      }
    }
  }

  if( $class == 'Dialog' ){
    if($_SERVER['REQUEST_METHOD'] == "GET"){
      if( isset($arg_1) ){
        if(is_numeric($arg_1)) {
          sendJSON( Dialog::getDialogsByNpcId($arg_1) );
          exit();
      } else {
        sendJSON( "Bad Request", 400);
        exit();
        }
      } else {
        sendJSON( Dialog::getAll() );
        exit();
      }
    }
  }

  if( $class == 'Puzzle' ){
    if($_SERVER['REQUEST_METHOD'] == "GET"){
      if( isset($arg_2) ){
          sendJSON( Puzzle::checkAnswerByPuzzleOrder($arg_1, $arg_2) );
          exit();
      } elseif (isset($arg_1) && is_numeric($arg_1)) {
        sendJSON(Puzzle::getPuzzlesByNPCId($arg_1));
        exit();
      } elseif (($arg_1 == 'order')) {
        sendJSON(Puzzle::getByOrder($arg_2));
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