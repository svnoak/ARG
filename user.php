<?php
require_once("./config.php");

class User
{

    static function create($username, $password){
        global $mysqli;
        $response = mysqli_query($mysqli, "INSERT INTO User VALUES ('NULL', $username, $password)");
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
}

?>