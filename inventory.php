<?php
require_once("./config.php");
include_once("./place.php");
include_once("./npc.php");

class Inventory
{

    // Takes all Menuoptions that are defined in the DB and renders them as a list.
    static function getMenuOptions(){
        global $mysqli;
        $options = mysqli_query($mysqli, "SELECT * FROM InventoryMenu");
        while ($row = $options->fetch_object()){
            $option_arr[] = $row;
        }
        return $option_arr;
    }

    // Gets NPCS according to Places in the UserinventoryTable
    // Each place has one NPC but NPCs can be found in several places.
    static function getNpcs($userID){
        global $mysqli;
        $places = self::getPlaces($userID);
        $npc_arr = [];

        foreach( $places as $place ){
            $placeID = $place->id;
            $npc = Npc::getByPlace($placeID);
            if( !in_array($npc, $npc_arr) ) $npc_arr[] = $npc;
        }
        return $npc_arr;
    }

    // Gets places user has been to.
    static function getPlaces($userID){
        global $mysqli;
        $inventoryPlaces = mysqli_query($mysqli, "SELECT * FROM UserInventory WHERE user = $userID AND place!=10 ORDER BY `id` ASC");
        while ($row = $inventoryPlaces->fetch_object()){
            if( $row-> id != 7 || $row-> id != 8 ){
                $inventoryPlaces_arr[] = $row;
            }
            
        }

        $places_arr = [];

        foreach( $inventoryPlaces_arr as $place ){
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
        $inventoryItems = mysqli_query($mysqli, "SELECT * FROM UserInventory WHERE user = $userID AND item IS NOT NULL ORDER BY `id` ASC");
        while ($row = $inventoryItems->fetch_object()){
            $inventoryItems_arr[] = $row;
            if( $row->id === 3 ) unset($items_arr[0]);
        }

        $items_arr = [];

        foreach( $inventoryItems_arr as $item ){
            $id = $item->item;
            $items = mysqli_query($mysqli, "SELECT * FROM Item WHERE id = $id");
            while ($row = $items->fetch_object()){
                $items_arr[] = $row;
            }
        }
        return $items_arr;
    }
    
}
?>