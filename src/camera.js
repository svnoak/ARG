import './assets/css/camera.css';
import haversine from 'haversine-distance';
import React, { createContext, useState } from 'react';
import Dialog from "./components/Dialog";
import PuzzleBottle from './components/puzzles/Bottle';
import PuzzleRings from './components/puzzles/Rings';
import PuzzleTrolls from './components/puzzles/Trolls';
import RuneTranslation from './components/puzzles/RuneTranslation';
import Alvkungen from './components/Alvkungen';
import AlvkungenRunes from './components/puzzles/AlvkungenRunes';
import AlvBattle from './components/puzzles/AlvBattle';
import KvarnLock from './components/puzzles/Kvarnen';

class Camera extends React.Component {
  constructor(props){
    super(props)
    localStorage.setItem("arg_user", '{"id":"1", "username":"Kim"}');
    this.state = {
      locations: JSON.parse(localStorage.getItem("locations")),
      place: {},
      npc: {},
      dialog: {},
      index: 0,
      lat: "",
      lon: "",
      user: JSON.parse(localStorage.getItem("arg_user")),
      playerIsNearLocation: false,
      answer: "",
      initialLocation: false,
      usingCamera: false
  }
    this.debug = true;
    this.dialogHandler = this.dialogHandler.bind(this);
    this.locationHandler = this.locationHandler.bind(this);
}

  /**
   * Gets userPosition and initializes locations on first startup.
   * Shows waiting element if Locations are still initialized.
   */
  async componentDidMount(){
    localStorage.getItem("arg_tipIndex") ?? localStorage.setItem("arg_tipIndex", 0);
    const waiting = document.querySelector("#waiting");
    if( !localStorage.getItem("locations") ){
      waiting.style.display = "flex";
      await this.initializeGameLocations();
      waiting.style.display = "none"
    }

    await this.setInitialLocation();
    
    /**
     * Gets Playerposition
     * @param {function} success - Runs the function if position was successfully determined
     * @param {function} error - Runs the callback for position not being retrieved
     */
    }

   startTracking(){
      console.log("Start tracking");

      const options = {
        enableHighAccuracy: true,
        timeout: 5000, 
        maximumAge: 0
      }
      navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error, options);
      this.setState({usingCamera: true});
    }
    

  async setInitialLocation(){
    const request = new Request(`https://dev.svnoak.net/api/user/initial/${this.state.user.id}`);
    const response = await fetch(request);
    const json = await response.json();
    this.setState({initialLocation: json});
  }

  /**
   * Fetches gamelocations from server and puts them in localstorage and state
   */
   async initializeGameLocations(){
    const request = new Request(`https://dev.svnoak.net/api/place`);
    const response = await fetch(request);
    const json = await response.json();
    localStorage.setItem("locations", JSON.stringify(json));
    this.setState({locations: JSON.parse(localStorage.getItem("locations"))});
  }

  /**
   * Removes the videobackground that ARjs places when moving to different page.
   */
  componentWillUnmount() {
    console.log("UNMOUNT");
    this.removeVideoBackground();
  }

  /**
   * Checks if player is near any gamelocation and sets state accordingly.
   * @param {object} pos - Object that holds player coordinates
   */
  async success(pos){
    console.log("Getting position");
    let playerLat = pos.coords.latitude;
    let playerLon = pos.coords.longitude;
    if( this.debug ){
      let locationID = document.querySelector("#location").value;
      let loc = this.locationHandler(locationID);
      let locLat = loc.latitude;
      let locLon = loc.longitude;

      playerLat = locLat;
      playerLon = locLon;
    }
    console.log("Checking location");
    const playerIsNearLocation  = await this.PlayerIsNearLocation(playerLat, playerLon);
    this.setState({
      playerIsNearLocation: playerIsNearLocation,
      lat: playerLat,
      lon: playerLon
    });
  }

  /**
   * Checks if player geolocation is near any matching gamelocations.
   * @param {object} coords - Object that holds player coordinates
   * @returns {bool}
   */
  async PlayerIsNearLocation(playerLat, playerLon){
    const playerLocation = { latitude: playerLat, longitude: playerLon };

    if( this.state.initialLocation ){
      await this.setPlaceState(10, this.state.user.id);    
      return true;
    }
    for( let location of this.state.locations ){
      const locationCoords = { latitude: location.latitude, longitude: location.longitude };
      const distance = haversine(playerLocation, locationCoords);
      if( distance < location.area ){
        console.log("Location found");
        await this.setPlaceState(location.id, this.state.user.id);
        return true;
      }
    }
    return false
  }


  /**
   * Fetches relevant dialogs and npc data from database depending on location
   * Sets state to be used by other functions.
   * @param {int} placeID 
   * @param {int} userID 
   */
  async setPlaceState(placeID, userID){
    console.log("Setting data");
    const request = new Request(`https://dev.svnoak.net/api/place/${placeID}/${userID}`);
    const response = await fetch(request);
    const json = await response.json();
      if( placeID == "6" ){
        let allNPCs = await this.fetchNPCS();
        allNPCs.push(json.npc);
        json.npc = allNPCs;
      }

    this.setState({
      place: json.place,
      npc: json.npc,
      dialog: json.dialog
    }, () => console.log(this.state));
  }

  /**
   * Warns if playerposition couldn't be retrieved
   * @param {object} err - Errorobject from watchposition function.
   */
  error(err){
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }


  /**
   * Checks what kind of dialog the player sees.
   * Triggers setDialog option or continues dialog accordingly
   * @param {string} triggerType - "puzzle", "trigger" or "dialog"
   */
  dialogHandler(triggerType){
    let index = this.state.index;
    let currentDialog = this.state.dialog[index];
    let dialogLength = this.state.dialog.length;
    let nextDialog = this.state.dialog[index + 1];
    let npc = this.state.npc;

    if( currentDialog ){
    
      if( nextDialog && nextDialog.reveal && npc.name != nextDialog.reveal ){
        console.log("REVEAL!")
        npc.name = nextDialog.reveal;
        this.setState({npc: npc});
      }

        // Check what kind of dialog is shown.
      if(currentDialog.type == "puzzle"){
        if( currentDialog.initial ) this.setState({initialLocation: false});
        this.setDialog(index, dialogLength, currentDialog);
      }
      
      // End if first dialog is shown and player doesn't click on npc.
      else if( index == 0 && triggerType != "trigger" ) return;
      
      // Check if dialog should be marked done or just continue to next
      else {
        if( currentDialog.markDone ){
          this.setDialog(index, dialogLength, currentDialog);
        } else if( currentDialog ){
          this.setState({index: this.state.index + 1});
        }
      }
    }
  }
  
  /**
   * Forwards player in dialog or puzzle accordingly and sets new dialog
   * Triggers markDone function if end of dialog or puzzleanswer is available
   * @param {int} index - Current index from state.index
   * @param {int} dialogLength - length of all dialogs state.dialog
   * @param {object} dialog - The current dialog depending on index and state.dialog
   * @param {string} answer - User submission, can be empty if use is in dialog screen
   */
  async setDialog(index, dialogLength, dialog, answer = ""){

    // If there is an input field, assign answer userInput
    if( document.querySelector("input") != null ){
      let userInput = document.querySelector("input").value
      answer = userInput ? userInput : "Inget svar"; 
    }

    // Move players forward in story or give appropriate puzzlefeedback.
    let dialogDone = await this.markDialogDone(dialog, answer);

      if( dialog.id == "19" && !dialogDone ){
        await this.markDialogDone(dialog, "Kvarn");
        localStorage.setItem("arg_ending", "fail");
      }

      if( (dialog.id == "19" && !dialogDone) || dialogDone ){
        // See so there are more dialogs to continue to otherwise reset all states
        if( index < dialogLength){
          if( dialog.id == "19" && localStorage.getItem("arg_ending") != "fail") localStorage.setItem("arg_ending", "success");
          let userEnding = localStorage.getItem("arg_ending");
          if( userEnding ){
            console.log("SET DIALOG FOR ENDING");
            this.setState( {dialog: this.state.dialog.filter(dialog => dialog.ending == userEnding || dialog.ending == undefined )} , this.setState({index: this.state.index + 1}));
            return
          }
          this.setState({index: this.state.index + 1});
        } else {
          this.setState({
            playerIsNearLocation: false, 
            index: 0, place: {}, 
            dialog:{}, npc:{},
            answer: "" });
        }
        localStorage.setItem("arg_tipIndex", 0);
      } else {
        this.setState({answer: answer});
      }
  }

  /**
   * Marks dialogs and puzzles done in databas
   * @param {object} dialog - current dialog user is seeing
   * @param {string} answer - usersubmission, if any.
   * @returns {bool}
   */
  async markDialogDone(dialog, answer){
    const request = new Request(`https://dev.svnoak.net/api/dialog/done`);
    const data = {
        dialog: dialog.id,
        user: this.state.user.id,
        place: this.state.place.id,
        tips: localStorage.getItem("arg_tipIndex"),
        answer: answer
    }

    let response = await fetch(request ,{
        method: 'POST',
        headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let json = await response.json();
    return json;
  }

  /**
   * Placeholder for when player is not near game location.
   * Placeholder for when gamelocation has no more dialogs or puzzles.
   * @returns {HTMLElement}
   */
  emptyPlace(){
    let npc = { imageLink: "transparent.png" };
          let dialog = {
            text: "Det verkar inte finnas något här",
            type: "placeholder"
        };
    let element =
    <Dialog
      npc = {npc}
      handler = {this.dialogHandler}
      dialog = {dialog}
    />
    return element;
  }

  /**
   * Removes videobackground
   */
  removeVideoBackground(){
    if(document.querySelector("video") != null){
      document.querySelectorAll("video").forEach(video => video.remove());
    }
  }

  locationHandler(locationID){
    let locations = this.state.locations;
    let choosenLocation = locations.find( location => location.id == locationID );
    return choosenLocation;
  }

  puzzleHandler(puzzle){
    console.log(puzzle.id);
    let puzzleElement;
    switch (puzzle.id) {
      case "2":
        puzzleElement = <PuzzleBottle 
        image={puzzle.imageLink} 
        text={puzzle.text}
        handler={this.dialogHandler}
        />
        break;
    
      case "5":
        puzzleElement = <PuzzleRings 
        image={puzzle.imageLink}
        text={puzzle.text}
        answer={this.state.answer}
        handler={this.dialogHandler}
        />
        break;

      case "12":
        puzzleElement = <PuzzleTrolls 
        image={puzzle.imageLink}
        text={puzzle.text}
        handler={this.dialogHandler}
        />
        break;

      case "16":
        puzzleElement = <RuneTranslation
        image={puzzle.image}
        text={puzzle.text}
        handler={this.dialogHandler}
        />
        break;
      
      case "19":
        puzzleElement = <AlvkungenRunes
        image={puzzle.image}
        text={puzzle.text}
        handler={this.dialogHandler}
        />
        break;

      case "25":
      case "27":
      case "29":
        puzzleElement = <AlvBattle
        image={puzzle.image}
        text={puzzle.text}
        handler={this.dialogHandler}
        />
        break;

      case "31":
        puzzleElement = <KvarnLock
        image={puzzle.image}
        text={puzzle.text}
        handler={this.dialogHandler}
        />
        break;
      default:
        break;
    }
    return puzzleElement;
  }

  async fetchNPCS(){
    const userID = this.state.user.id;
    const request = new Request(`https://dev.svnoak.net/api/inventory/npc/${userID}`);
    const response = await fetch(request);
    return await response.json();
  }

  /**
   * Conditianlly displays puzzle or dialog to player
   * @returns {HTMLElement}
   */
  displayElement(){
    const isAtLocation = this.state.playerIsNearLocation;
    let element;
    let currentDialog = "";

    // Player is at location and there are dialogs in DB
    if( isAtLocation ){
      if( this.state.dialog ) {
        currentDialog = this.state.dialog[this.state.index];

        // If there are dialogs/puzzles at the location, return elements accordingly
        if( currentDialog ){
          if( currentDialog.type == "dialog" || currentDialog.type == "info" ){

            // If dialog, check who speaks or if it's only an info dialog.
              if( this.state.place.id == "6" ){
                console.log(this.state.npc);
                element = <Alvkungen
                    npc = {this.state.npc}
                    user = {this.state.user}
                    dialog = {currentDialog}
                    triggerHandler = {this.triggerHandler}
                    dialogTriggered = {this.state.dialogTriggered} 
                    dialogHandler = {this.dialogHandler}
                  />
              } else {
                element = <Dialog 
                npc = {this.state.npc}
                user = {this.state.user}
                dialog = {currentDialog}
                triggerHandler = {this.triggerHandler}
                dialogTriggered = {this.state.dialogTriggered} 
                dialogHandler = {this.dialogHandler}
                />;
              }
                
              }

              // Set puzzle depending on textbased or AR.
              else if( currentDialog.type == "puzzle"){
                this.removeVideoBackground();
                element = this.puzzleHandler(currentDialog);
                /* if( currentDialog.interaction == "text" ){
                  this.removeVideoBackground();

                  element =
                  <Textpuzzle
                    handler = {this.dialogHandler}
                    answer = {this.state.answer}
                    dialog = {currentDialog}
                    />
                } else {
                  console.log("PUZZLE TIME!");
                  element = 
                  <ARpuzzle
                  dialog={currentDialog} 
                  handler = {this.dialogHandler}
                  />
                } */
                  
                }

              // Create some sort of notification and save newly income chat in localStorage
              else if( currentDialog.type == "chat" ){
                document.querySelector("nav > a:first-child").classList.add("notification");
                let chatMessages = this.state.dialog.filter( dialog => dialog.type == "chat" );
                let stringifiedChat = JSON.stringify(chatMessages);
                localStorage.setItem("arg_dialog", stringifiedChat);
                localStorage.setItem("arg_place", this.state.place.id);
              }
          } else {
            element = this.emptyPlace();
          }
        } else {
          element = this.emptyPlace();          
        }
      }

      return element;
  }

  render(){
    return(
      <div id="cameraScene">
        <Waiting />
        { !this.state.usingCamera && <CameraPrompt track={this.startTracking.bind(this)}/>}
        { !this.state.playerIsNearLocation && this.state.usingCamera && this.emptyPlace() }
        {  this.state.playerIsNearLocation && this.state.usingCamera && this.displayElement() }
        { this.debug && <LocationList handler={this.locationHandler}/> }
      </div>
    )
  }
}


/**
 * Overlay while fetching locations at initial startup.
 * @returns {HTMLElement}
 */
function Waiting(){
  return(
    <div id="waiting">
      Initializing Locations
    </div>
  )
}

function LocationList(props){
  return(
    <div id="locationChanger">
      <select name="locations" id="location">
        <option value="1">Gamla Väster</option>
        <option value="2">Boulebaren</option>
        <option value="3">Baltazargatan</option>
        <option value="4">Lugnet</option>
        <option value="5">Davidshall</option>
        <option value="6">Stadsbiblioteket</option>
        <option value="7">Lilla Dammen</option>
        <option value="8">Stora Dammen</option>
        <option value="9">Slottsmöllan</option>
      </select>
      <button onClick={() => props.handler()}>Set location</button>
    </div>
  )
}

function CameraPrompt(props){
  return(
    <div onClick={() => props.track()}>
      Aktivera kamera
    </div>
  )
}
 
export default Camera;