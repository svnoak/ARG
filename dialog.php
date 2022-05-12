<?php
require_once("./config.php");
include_once("./place.php");
include_once("./puzzle.php");
include_once("./npc.php");
include_once("./user.php");

class Dialog
{

    static function getLastDialog($userID){
        global $mysqli;
        $currentDialog = mysqli_query($mysqli, "SELECT lastDialog FROM User WHERE id = $userID");
        return $currentDialog->fetch_object()->lastDialog;
    }

    static function getByPlace($placeID, $userID){
        global $mysqli;
        $lastDialog = self::getLastDialog($userID);
        $userEnding = User::getEnding($userID)->ending;
        $query;
        if( !$userEnding ){
            $query = "SELECT * FROM Dialog WHERE place=$placeID AND `order`>$lastDialog ORDER BY `order` ASC";
        } else {
            $query = "SELECT * FROM Dialog WHERE place=$placeID AND `order`>$lastDialog AND (`ending`='$userEnding' OR `ending` IS NULL) ORDER BY `order` ASC";
        }
        $dialog = mysqli_query($mysqli, $query);
        while ($row = $dialog->fetch_object()){
            $dialog_arr[] = $row;
        }
       return $dialog_arr;
    }

    static function markDone($dialogID, $userID, $placeID, $answer, $tipIndex){
        global $mysqli;
        $ending = User::getEnding($userID)->ending;
        if( $answer != "" ){
            $puzzleSolved = Puzzle::checkAnswer($dialogID, $answer);
            if( !$puzzleSolved ){
                if( $dialogID == 22){
                    $ending = 'fail';
                    return ["ending"=>$ending, "done"=>true];
                } else {
                    return ["ending"=>$ending, "done"=>$puzzleSolved];
                }
            } elseif( $dialogID == 22 ){
                $ending = 'success';
                return ["ending"=>$ending, "done"=>true];
            }
        }

        $dialogResponse = mysqli_query($mysqli, "UPDATE User SET lastDialog=$dialogID WHERE id = $userID");
        $endingResponse = mysqli_query($mysqli, "UPDATE User SET ending=$ending WHERE id = $userID");
        $rewardQuery = mysqli_query($mysqli, "SELECT reward FROM Dialog WHERE id = $dialogID");
        $rewardID = $rewardQuery->fetch_object()->reward;
        $rewardResponse = true;
        if( $rewardID != null ){
            $rewardExists_query = mysqli_query($mysqli, "SELECT * FROM UserInventory WHERE user = $userID AND item = $rewardID ");
            $rewardExists = $rewardExists_query->fetch_object() != null;
            if( !$rewardExists ) {
                $rewardResponse = mysqli_query($mysqli, "INSERT INTO UserInventory(user, item) VALUES ($userID, $rewardID) ");
            }
        }

        $tipIndexQuery = mysqli_query($mysqli, "INSERT INTO UserTip(userID, dialogID, tips) VALUES ($userID, $dialogID, $tipIndex)");

        $placeExists_query = mysqli_query($mysqli, "SELECT * FROM UserInventory WHERE user = $userID AND place = $placeID ");
        $placeExists = $placeExists_query->fetch_object() != null;

        $inventoryPlaceResponse = true;
        if( !$placeExists ){
            $inventoryPlaceResponse = mysqli_query($mysqli, "INSERT INTO UserInventory(user, place) VALUES ($userID, $placeID) ");
        }

        return ["ending"=>$ending, "done"=>true];
    }

    static function getSentMessages($userID){
        global $mysqli;
        $userEnding = User::getEnding($userID)->ending;
        $lastDialog = self::getLastDialog($userID);
        $chatMessages = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE `order`<=$lastDialog AND (`ending`='$userEnding' OR `ending` IS NULL) AND NOT `type`='dialog'");
        $puzzleTips = mysqli_query($mysqli, "SELECT dialogID, tips FROM UserTip WHERE `userID`=$userID");

        $puzzleTips_arr =[];
        while ($row = $puzzleTips->fetch_object()){
            $puzzleTips_arr[] = $row;
        }

        $message_arr = [];
        while ($row = $chatMessages->fetch_object()){
            $message_arr[] = $row;
        }

        $messages = [];
        foreach( $message_arr as $message ){
            $fileName = $message->jsonLink;
            $type = $message->type;
            $path = "../assets/$type/$fileName";
            $file = json_decode(file_get_contents($path), true);
            if( $type == "puzzle" ){
                $tipsArrColumn = array_column($puzzleTips_arr, "dialogID");
                $tipsIndex = array_search($message->id, $tipsArrColumn);
                $numTips = $puzzleTips_arr[$tipsIndex]->tips;
                $tipsText = array_slice($file["tips"], 0, $numTips);
                foreach( $tipsText as $index=>$tip ){
                    $userRequest = ["speaker"=>"player", "text"=>"Jag kommer inte vidare, har du något tips?"];
                    $tipsMessage = ["text"=>$tip, "speaker"=>"anon"];
                    $messages[] = $userRequest;
                    $messages[] = $tipsMessage;
                }
            } else {
                foreach( $file as $messageObject ){
                    $messages[] = $messageObject;
                }
            }
        }
        return $messages;
    }

    static function getInitialMessages(){
        global $mysqli;
        $messages = mysqli_query($mysqli, "SELECT * FROM Dialog WHERE `place`=10");
        while ($row = $messages->fetch_object()){
            $message_arr[] = $row;
        }
        return self::fetchDialogs($message_arr);
    }

    // Gets dialogues and puzzles, and removes and adds relevant info for the client to be directly used.
    static function fetchDialogs($dialogData){
        $dialogs = [];
        foreach( $dialogData as $dialog ){
            $fileName = $dialog->jsonLink;
            $type = $dialog->type;
            $path = "../assets/$type/$fileName";
            $file = json_decode(file_get_contents($path), true);
             if( $type == 'puzzle' ){
                unset($file['solution']);
                $file['id'] = $dialog->order;
                $dialogs[] = $file;
            } else {
                foreach( $file as $dialogObject ){
                    if( $dialogObject['markDone'] ){
                        $dialogObject['id'] = $dialog->order;
                        $dialogObject['place'] = $dialog->place;
                    }
                    $dialogs[] = $dialogObject;
                }
            }
        }

        return $dialogs;
    }

       
}

?>