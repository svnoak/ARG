<?php
require_once("./config.php");

class User
{

    static function create($username, $password){
        global $mysqli;
        $response = mysqli_query($mysqli, "INSERT INTO User(name,password) VALUES ('$username', $password)");
        return $response;
    }

    static function get($username, $password){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT * FROM User WHERE name = '$username' AND password = $password");
            return $user->fetch_object();
    }

    static function exists($username){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT * FROM User WHERE name = '$username'");
        return $user->fetch_object() !== null;
    }

    static function getNextDialog($username, $password){
        global $mysqli;
        $lastDialog = mysqli_query($mysqli, "SELECT lastDialog FROM User WHERE name = '$username' AND password = $password");
        return $lastDialog + 1;
    }
}

?>