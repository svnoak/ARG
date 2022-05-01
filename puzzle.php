<?php
require_once("./config.php");

class Puzzle
{

    static function getByOrder($order){
        global $mysqli;
        $dialog = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE `order` = $order");
        return $dialog->fetch_object();
    }

    static function getPuzzlesByNPCId($id){
        global $mysqli;
        $puzzle = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE `type` = 'puzzle' AND `npc` = $id");
            while ($row = $puzzle->fetch_object()){
                $puzzle_arr[] = $row;
            }
           return $puzzle_arr;
    }

    static function checkAnswerByPuzzleOrder($order, $answer){
        global $mysqli;
        $query = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE `order` = $order AND `type` = 'puzzle'");
        $puzzle = $query->fetch_object();
        $fileName = $puzzle->jsonLink;
        $path = "./puzzle/$fileName";
        $file = json_decode(file_get_contents($path),true);
        return $file['solution'] == $answer;
    }
}

?>