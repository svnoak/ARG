<?php
require_once("./config.php");
include_once("./place.php");
include_once("./npc.php");

class Archive
{

    // Takes all Menuoptions that are defined in the DB and renders them as a list.
    static function getMenuOptions(){
        global $mysqli;
        $options = mysqli_query($mysqli, "SELECT * FROM ArchiveMenu");
        while ($row = $options->fetch_object()){
            $option_arr[] = $row;
        }
        return $option_arr;
    }

    // Gets NPCS according to Places in the UserArchiveTable
    // Each place has one NPC but NPCs can be found in several places.
    static function getNpcs($userID){
        global $mysqli;
        $places = self::getPlaces($userID);
        $npc_arr = [];

        foreach( $places as $place ){
            $placeID = $place->id;
            $npc = Npc::getByPlace($placeID);
            $npc_arr[] = $npc;
        }
        
        return $npc_arr;
    }

    // Gets places user has been to.
    static function getPlaces($userID){
        global $mysqli;
        $archivePlaces = mysqli_query($mysqli, "SELECT * FROM UserArchive WHERE user = $userID AND place IS NOT NULL");
        while ($row = $archivePlaces->fetch_object()){
            $archivePlaces_arr[] = $row;
        }

        $places_arr = [];

        foreach( $archivePlaces_arr as $place ){
            $id = $place->place;
            $places = mysqli_query($mysqli, "SELECT * FROM Place WHERE id = $id");
            while ($row = $places->fetch_object()){
                $places_arr[] = $row;
            }
        }
        return $places_arr;
    }

    // Gets items user has in inventory
    static function getItems($userID){
        global $mysqli;
        $archiveItems = mysqli_query($mysqli, "SELECT * FROM UserArchive WHERE user = $userID AND item IS NOT NULL");
        while ($row = $archiveItems->fetch_object()){
            $archiveItems_arr[] = $row;
        }

        $items_arr = [];

        foreach( $archiveItems_arr as $item ){
            $id = $item->item;
            $items = mysqli_query($mysqli, "SELECT * FROM Item WHERE id = $id");
            while ($row = $items->fetch_object()){
                $items_arr[] = $row;
            }
        }
        return $items_arr;
    }

    // Gets relevant dialog that user has not yet gotten.
    static function getDialog($placeID, $userID){
        global $mysqli;
        $lastDialog = Dialog::getLastDialog($userID);
        $dialogs = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE place = $placeID AND `order` > $lastDialog ORDER BY `order` ASC");
        while ($row = $dialogs->fetch_object()){
            $dialog_arr[] = $row;
        }
        return $dialog_arr;
    }

    // Gets dialogues and puzzles, and removes and adds relevant info for the client to be directly used.
    static function fetchDialogs($dialogData){
        $dialogs = [];
        foreach( $dialogData as $dialog ){
            $fileName = $dialog->jsonLink;
            $type = $dialog->type;
            $path = "./$type/$fileName";
            $file = json_decode(file_get_contents($path), true);
            if( $type == 'puzzle' ){
                unset($file['solution']);
                $file['id'] = $dialog->id;
                $dialogs[] = $file;
            } else {
                foreach( $file as $dialogObject ){
                    if( $dialogObject['markDone'] ){
                        $dialogObject['id'] = $dialog->id;
                    }
                    $dialogs[] = $dialogObject;
                }
            }
        }

        return $dialogs;
    }

    // Packs all data for client to be used for each place.
    static function getData($placeID, $userID){
        $npc = self::getNPC($placeID);
        $dialogData = self::getDialog($placeID, $userID);
        $dialogs = self::fetchDialogs($dialogData);
        $place = self::getPlaceByID($placeID);
        $data = ["npc" =>$npc, "dialog"=>$dialogs, "place"=>$place];
        return $data;
    }
    
}
?>