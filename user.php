<?php
require_once("./config.php");

class User
{

    static function create($username, $password){
        global $mysqli;
        mysqli_query($mysqli, "INSERT INTO USER(name, password) VALUES ($username, $password)");
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