<?php
require_once("./config.php");
include_once("./dialog.php");

class Place
{

    // GETs all places
    static function getAll(){
        global $mysqli;
        $places = mysqli_query($mysqli, "SELECT * FROM Place");
            while ($row = $places->fetch_object()){
                $place_arr[] = $row;
            }
           return $place_arr;
    }

    // Gets the place
    static function getPlaceByID($id){
        global $mysqli;
        $place_query = mysqli_query($mysqli, "SELECT * FROM Place WHERE id = $id");
        return $place_query->fetch_object();
    }

    // Gets NPC for the specific place
    static function getNPC($id){
        global $mysqli;
        $npcID = self::getPlaceByID($id)->npc;
        $npc_query = mysqli_query($mysqli, "SELECT * FROM NPC WHERE id = $npcID");
        return $npc_query->fetch_object();
    }

/*     // Gets relevant dialog that user has not yet gotten.
    static function getDialog($placeID, $userID){
        global $mysqli;
        $lastDialog = Dialog::getLastDialog($userID);
        $dialogs = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE place = $placeID AND `order` > $lastDialog ORDER BY `order` ASC");
        while ($row = $dialogs->fetch_object()){
            $dialog_arr[] = $row;
        }
        return $dialog_arr;
    } */

    
    // Packs all data for client to be used for each place.
    static function getData($placeID, $userID){
        $npc = self::getNPC($placeID);
        $dialogData = Dialog::getByPlace($placeID, $userID);
        $dialogs = Dialog::fetchDialogs($dialogData);
        $place = self::getPlaceByID($placeID);
        $data = ["place"=>$place, "npc" =>$npc, "dialog"=>$dialogs];
        return $data;
    }
    
}
?>