<?php
require_once("./config.php");

class User
{

    static function create($username, $password){
        mysqli_report(MYSQLI_REPORT_ALL);
        global $mysqli;
        $response = mysqli_query($mysqli, "INSERT INTO User(name,password) VALUES ('$username', $password)");
        return $response;
    }

    static function get($username, $password){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT * FROM User WHERE name = $username AND password = $password");
            while ($row = $user->fetch_object()){
                $user_arr[] = $row;
            }
            return $user_arr;
    }

    static function exists($username){
        global $mysqli;
        $user = mysqli_query($mysqli, "SELECT * FROM User WHERE name = '$username'");
            while ($row = $user->fetch_object()){
                $user_arr[] = $row;
            }
            return count($user_arr) > 0;
    }
}

?>