<?php
require_once("./config.php");
include_once("./place.php");
include_once("./npc.php");
include_once("./item.php");

class Archive
{

    static function getMenuOptions(){
        global $mysqli;
        $options = mysqli_query($mysqli, "SELECT * FROM ArchiveMenu");
        while ($row = $options->fetch_object()){
            $option_arr[] = $row;
        }
        return $option_arr;
    }

    static function getNpcs($userID){
        global $mysqli;
        $places = self::getPlaces($userID);
        $npc_arr = [];

        foreach( $places as $place ){
            $placeID = $place->id;
            $npc_query = Npc::getByPlace($placeID);
            while ($row = $options->fetch_object()){
                $npc_arr[] = $row;
            }
        }
       return $npc_arr;
    }

    static function getPlaces($userID){
        global $mysqli;
        $npcID = self::getPlaceByID($id)->npc;
        $npc_query = mysqli_query($mysqli, "SELECT * FROM NPC WHERE id = $npcID");
        return $npc_query->fetch_object();
    }

    static function getItems($userID){

    }

    static function getDialog($placeID, $userID){
        global $mysqli;
        $lastDialog = Dialog::getLastDialog($userID);
        $dialogs = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE place = $placeID AND `order` > $lastDialog ORDER BY `order` ASC");
        while ($row = $dialogs->fetch_object()){
            $dialog_arr[] = $row;
        }
        return $dialog_arr;
    }

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

    static function getData($placeID, $userID){
        $npc = self::getNPC($placeID);
        $dialogData = self::getDialog($placeID, $userID);
        $dialogs = self::fetchDialogs($dialogData);
        $place = self::getPlaceByID($placeID);
        $data = ["npc" =>$npc, "dialog"=>$dialogs, "place"=>$place];
        return $dialogs;
    }
    
}
?>