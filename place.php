<?php
require_once("./config.php");
include_once("./dialog.php");

class Place
{

    static function getAll(){
        global $mysqli;
        $places = mysqli_query($mysqli, "SELECT * FROM Place");
            while ($row = $places->fetch_object()){
                $place_arr[] = $row;
            }
           return $place_arr;
    }

    static function getPlaceByID($id){
        global $mysqli;
        $place_query = mysqli_query($mysqli, "SELECT * FROM Place WHERE id = $id");
        return $place_query->fetch_object();
    }

    static function getNPC($id){
        global $mysqli;
        $npcID = self::getPlaceByID($id)->npc;
        $npc_query = mysqli_query($mysqli, "SELECT * FROM NPC WHERE id = $npcID");
        return $npc_query->fetch_object();
    }

    static function getDialog($placeID, $userID){
        global $mysqli;
        $lastDialog = Dialog::getLastDialog($userID);
        $dialogs = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE place = $placeID AND `order` > 1");
        return $dialogs->fetch_object();
        /* while ($row = $dialogs->fetch_object()){
            $dialog_arr[] = $row;
        }
        return $dialog_arr; */
    }

    static function getData($placeID, $userID){
        $npc = self::getNPC($placeID);
        $dialog = self::getDialog($placeID, $userID);
        $place = self::getPlaceByID($placeID);

        $data = ["npc" =>$npc, "dialog"=>$dialog, "place"=>$place];
        return $dialog;
        
    }
    
}
?>