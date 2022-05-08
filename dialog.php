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
        $dialog = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE place=$placeID AND `order`>$lastDialog");
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
            $rewardExists_query = mysqli_query($mysqli, "SELECT * FROM UserInventory WHERE user = $userID AND item = $rewardID ");
            $rewardExists = $rewardExists_query->fetch_object() != null;
            if( !$rewardExists ) {
                $reward_response = mysqli_query($mysqli, "INSERT INTO UserInventory(user, item) VALUES ($userID, $rewardID) ");
            }
        }
        $placeExists_query = mysqli_query($mysqli, "SELECT * FROM UserInventory WHERE user = $userID AND place = $placeID ");
        $placeExists = $placeExists_query->fetch_object() != null;

        $inventoryPlaceResponse = true;
        if( !$placeExists ){
            $inventoryPlaceResponse = mysqli_query($mysqli, "INSERT INTO UserInventory(user, place) VALUES ($userID, $placeID) ");
        }
        return $dialogRespone && $rewardResponse && $inventoryPlaceResponse;
    }

    static function getSentMessages($userID){
        global $mysqli;
        $lastDialog = getLastDialog($userID);
        $chatMessages = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE `order`<=$lastDialog AND `type` = 'chat'");
        while ($row = $chatMessages->fetch_object()){
            $message_arr[] = $row;
        }
       return $message_arr;
    }
    
}

?>