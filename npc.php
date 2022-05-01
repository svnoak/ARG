<?php
require_once("./config.php");
require_once("./place.php");

class Npc
{
    static function getByPlace($placeID){
        global $mysqli;
        $npcID = Place::getPlaceByID($placeID)->npc;
        $npc = mysqli_query($mysqli, "SELECT * FROM NPC WHERE id = $npcID");
        return $npc->fetch_object();
    }

}

?>