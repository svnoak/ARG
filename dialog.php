<?php
require_once("./config.php");

class Dialog
{

    static function getAll(){
        global $mysqli;
        $dialog = mysqli_query($mysqli, "SELECT * FROM Dialog");
            while ($row = $dialog->fetch_object()){
                $dialog_arr[] = $row;
            }
           return $dialog_arr;
    }

    static function getDialogsByNpcId($id){
        global $mysqli;
        $dialog = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE npc = $id");
        while ($row = $dialog->fetch_object()){
            $dialog_arr[] = $row;
        }
       return $dialog_arr;
    }
}

?>