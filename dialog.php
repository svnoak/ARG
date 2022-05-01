<?php
require_once("./config.php");

class Dialog
{
    static function getDialogsByNpcId($id){
        global $mysqli;
        $dialog = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE npc = $id AND type = 'dialog'");
        while ($row = $dialog->fetch_object()){
            $dialog_arr[] = $row;
        }
       return $dialog_arr;
    }

    static function getByOrder($order){
        global $mysqli;
        $dialog = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE order = $order");
        return $dialog->fetch_object();
    }
}

?>