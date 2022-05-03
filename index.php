<?php
require_once("return.php");
require_once("config.php");
include_once("email.php");
include_once("user.php");
include_once("place.php");
include_once("dialog.php");
include_once("puzzle.php");
include_once("npc.php");
include_once("archive.php");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  // Tillåt alla (origins) och alla headers
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: *");
  exit();
}
header("Access-Control-Allow-Origin: *");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

$table = $uri[2];
$arg_1 = $uri[3];
$arg_2;
if( isset($uri[4]) ) $arg_2 = $uri[4];

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
      $input = json_decode(file_get_contents("php://input"), true);
      sendJSON($input);
      exit();
      if( isset($_POST) ){
        $username = $_POST['username'];
        $password = $_POST['password'];
        $id = $_POST['id'];

        if( $arg_1 == "create" ){
          if( User::exists($username) ){
            sendJSON("User already exists", 409);
            exit();
          }
            $response = User::create($username, $password);
            if( $response ){
              sendJSON( User::login($username, $password), 201 );
              exit();
            } else{
              sendJSON( "Error creating user", 500 );
            }

        } elseif ( $arg_1 == "login" ) {
          sendJSON( User::login($username, $password) );
          exit();
        }
      }
    } else{
        sendJSON( "WRONG METHOD", 403 );
        exit();
      }
  }

  if( $class == 'Place' ){
    if($_SERVER['REQUEST_METHOD'] == "GET"){
      if( isset($arg_1) ){
        if( $arg_1 == 'get'){
        sendJSON( Place::getPlaceByID($arg_2));
        exit();
        } elseif( is_numeric($arg_1) ) {
          sendJSON( Place::getData($arg_1, $arg_2) );
          exit();
        } else {
          sendJSON( "Bad Request", 400 );
          exit();
        }
      }
      else{
        sendJSON( "WRONG METHOD", 403 );
        exit();
      }
    }
  }
/* 
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
    } else{
        sendJSON( "WRONG METHOD", 403 );
        exit();
    }
  } */

  if( $class == 'Dialog' ){
    if($_SERVER['REQUEST_METHOD'] == "POST"){
      $dialogID = $_POST['dialog'];
      $userID = $_POST['user'];
      $placeID = $_POST['place'];
      $answer = $_POST['answer'];
      if( isset($arg_1) ){
        if( $arg_1 == 'done' ) {
          sendJSON( Dialog::markDone($dialogID, $userID, $placeID, $answer) );
          exit();
        }
      } else {
          sendJSON( "Bad Request", 400);
          exit();
        }
    } else{
        sendJSON( "WRONG METHOD", 403 );
        exit();
      }
    }

  if( $class == 'Archive' ){
    if( $arg_1 == 'npc' ){
      if( is_numeric($arg_2) ){
        sendJSON(Archive::getNpcs($arg_2));
        exit();
      } else {
          sendJSON( "Bad Request", 400);
          exit();
      }
    } elseif( $arg_1 == 'place' ){
        if( is_numeric($arg_2) ){
          sendJSON(Archive::getPlaces($arg_2));
          exit();
        } else {
            sendJSON( "Bad Request", 400);
            exit();
        }
      } elseif( $arg_1 == 'item' ){
        if( is_numeric($arg_2) ){
          sendJSON(Archive::getItems($arg_2));
          exit();
        } else {
            sendJSON( "Bad Request", 400);
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