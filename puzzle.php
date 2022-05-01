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
        return $puzzle;
        /* $file = file_get_contents(json_decode("./puzzle/$path", true));
        $solution = $file.solution;
        return $solution; */
    }
}

?>