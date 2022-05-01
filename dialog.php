<?php
require_once("./config.php");
include_once("./place.php");
include_once("./puzzle.php");

class Dialog
{

    static function getLastDialog($userID){
        global $mysqli;
        $currentDialog = mysqli_query($mysqli, "SELECT lastDialog FROM User WHERE id = $userID");
        return $currentDialog->fetch_object()->lastDialog;
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

    static function markDone($dialogID, $userID, $placeID, $answer){
        global $mysqli;
        if( $answer != "" ){
            $puzzleSolved = Puzzle::checkAnswer($dialogID, $answer);
            if( !$puzzleSolved ){
                return $puzzleSolved;
            }            
        }

        $dialog_respone = mysqli_query($mysqli, "UPDATE User SET lastDialog = $dialogID WHERE id = $userID");
        $reward_query = mysqli_query($mysqli, "SELECT reward FROM Dialog WHERE id = $dialogID");
        $rewardID = $reward_query->fetch_object()->id;
        $reward_response = true;
        if( $rewardID != null ){
           $reward_response = mysqli_query($mysqli, "INSERT INTO UserArchive(user, item) VALUES ($userID, $rewardID) ");
        }
           $archive_response = mysql_query($mysqli, "INSERT INTO UserArchive(user, place) VALUES ($userID, $placeID) ");

        return $dialog_respone && $reward_response && $archive_response;
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