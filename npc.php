<?php
require_once("./config.php");
require_once("./place.php");

class Npc
{
    static function getByPlace($placeID){
        global $mysqli;

        $npc = mysqli_query($mysqli, "SELECT * FROM NPC WHERE id = $placeID");
        return $npc->fetch_object();
    }
}

?>