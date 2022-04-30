<?php
require_once("./config.php");

class Npc
{

    static function getAll(){
        global $mysqli;
        $npc = mysqli_query($mysqli, "SELECT * FROM NPC");
            while ($row = $npc->fetch_object()){
                $npc_arr[] = $row;
            }
           return $npc_arr;
    }

    static function getById($id){
        global $mysqli;
        $npc = mysqli_query($mysqli, "SELECT * FROM NPC WHERE id = $id");
        return $npc->fetch_object();

    }
}

?>