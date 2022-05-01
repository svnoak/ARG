<?php
require_once("./config.php");
include_once("./place.php");
include_once("./puzzle.php");
include_once("./npc.php");

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

        $dialogRespone = mysqli_query($mysqli, "UPDATE User SET lastDialog = $dialogID WHERE id = $userID");
        $rewardQuery = mysqli_query($mysqli, "SELECT reward FROM Dialog WHERE id = $dialogID");
        $rewardID = $rewardQuery->fetch_object()->reward;
        $rewardResponse = true;
        if( $rewardID != null ){
           $reward_response = mysqli_query($mysqli, "INSERT INTO UserArchive(user, item) VALUES ($userID, $rewardID) ");
        }
        $placeExists_query = mysqli_query($mysqli, "SELECT * FROM UserArchive WHERE user = $userID AND place = $placeID ");
        $placeExists = $placeExists_query->fetch_object();

        $archivePlaceResponse = true;
        if( $placeExists == null ){
            $archivePlaceResponse = mysqli_query($mysqli, "INSERT INTO UserArchive(user, place) VALUES ($userID, $placeID) ");
        }
        return $dialogRespone && $rewardResponse && $archivePlaceResponse;
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