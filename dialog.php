<?php
require_once("./config.php");

class Dialog
{

    static function getLastDialog($userID){
        global $mysqli;
        $currentDialog = mysqli_query($mysqli, "SELECT lastDialog FROM User WHERE id = $id");
        return $currentDialog;
    }

    static function getByPlace($placeID, $userID){
        global $mysqli;
        $lastDialog = getLastDialog($userID);
        $dialog = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE place = $placeID AND order  > $lastDialog ");
        while ($row = $dialog->fetch_object()){
            $dialog_arr[] = $row;
        }
       return $dialog_arr;
    }
/* 


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

    

    static function next($userID){
        return getLastDialog($userID) + 1;
    } */

    
}

?>