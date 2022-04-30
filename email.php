<?php
require_once("./config.php");

class Email
{

    static function getAll(){
        global $mysqli;
        $emails = mysqli_query($mysqli, "SELECT * FROM Email");
            while ($row = $emails->fetch_object()){
                $email_arr[] = $row;
            }
           return $email_arr;
    }

    static function getById($id){
        global $mysqli;
        $emails = mysqli_query($mysqli, "SELECT * FROM Email WHERE email_id = $id");
            while ($row = $emails->fetch_object()){
                $email_arr[] = $row;
            }
           return $email_arr;
    }
}

?>