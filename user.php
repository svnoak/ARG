<?php
require_once("./config.php");

class User
{

    static function create($username, $password){
        global $mysqli;
        $response = mysqli_query($mysqli, "INSERT INTO User(name,password) VALUES ('$username', $password)");
        return $response;
    }

    static function exists($username){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT * FROM User WHERE name = '$username'");
        return $user->fetch_object() !== null;
    }

    static function login($username, $password){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT id FROM User WHERE name = '$username' AND password = $password");
            return $user->fetch_object();
    }

    static function get($id){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT * FROM User WHERE id = $id");
            return $user->fetch_object();
    }

}

?>