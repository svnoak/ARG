<?php
require_once("./config.php");

class User
{

    // Creates user and returns true or false
    static function create($username, $password){
        global $mysqli;
        $response = mysqli_query($mysqli, "INSERT INTO User(name,password) VALUES ('$username', $password)");
        return $response;
    }

    // Checks if a user exists and returns true or false
    static function exists($username){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT * FROM User WHERE name = '$username'");
        return $user->fetch_object() !== null;
    }

    // Gets user from DB and returns the user id object
    static function login($username, $password){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT id, name FROM User WHERE name = '$username' AND password = $password");
            return $user->fetch_object();
    }

    // Gets the userobject, questionably if needed?
    static function isAtInitialLocation($id){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT lastDialog FROM User WHERE id = $id");
        $lastDialog = $user->fetch_object();
        $initialDialogQuery = mysqli_query($mysqli, "SELECT MAX(`order`) FROM Dialog WHERE place=10");
        $initialDialog = $initialDialogQuery->fetch_object();
        echo $lastDialog;
        return $lastDialog;
    }

}

?>