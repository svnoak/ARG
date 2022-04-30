<?php
require_once("./config.php");

class Dialog
{

    static function getAll(){
        global $mysqli;
        $npc = mysqli_query($mysqli, "SELECT * FROM NPC");
            while ($row = $npc->fetch_object()){
                $npc_arr[] = $row;
            }
           return $npc_arr;
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