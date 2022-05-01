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
                    if( isset($file['markDone']) ){
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
        $data = ["npc" =>$npc, "dialog"=>$dialogs];
        return $dialogs;
    }
    
}
?>