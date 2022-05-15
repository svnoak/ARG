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
import PaperPickup from './components/puzzles/PaperPickup';
import "./assets/css/puzzle.css"

class Camera extends React.Component {
  constructor(props){
    super(props)
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
    document.querySelector("#cameraNav").classList.remove("notification");
    localStorage.getItem("arg_tipIndex") ?? localStorage.setItem("arg_tipIndex", 0);
    const waiting = document.querySelector("#waiting");
    if( !localStorage.getItem("locations") ){
      waiting.style.display = "flex";
      await this.initializeGameLocations();
      waiting.style.display = "none"
    }

    await this.setInitialLocation();

    if( !this.state.usingCamera ) this.removeVideoBackground();
    }

  /**
   * Gets Playerposition
   * @param {function} success - Runs the function if position was successfully determined
   * @param {function} error - Runs the callback for position not being retrieved
   */
   startTracking(){
     console.log("TRACKING");
      const options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }
      navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error, options);
      this.setState({usingCamera: true});
    }
    
/**
 * Gets locations from server.
 */
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
    console.log("TRACKING USER");
    console.log(pos);
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
        await this.setPlaceState(location.id, this.state.user.id);
        return true;
      }
    }
    return false;
  }


  /**
   * Fetches relevant dialogs and npc data from database depending on location
   * Sets state to be used by other functions.
   * @param {int} placeID 
   * @param {int} userID 
   */
  async setPlaceState(placeID, userID){
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
    });
  }

  /**
   * Warns if playerposition couldn't be retrieved
   * @param {object} err - Errorobject from watchposition function.
   */
  error(err){
    alert("Något gick fel. Har du aktiverat din GPS?");
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }


  /**
   * Checks what kind of dialog the player sees.
   * Triggers setDialog option or continues dialog accordingly
   * @param {string} triggerType - "puzzle", "trigger" or "dialog"
   */
  dialogHandler(triggerType){
    console.log(triggerType);
    let index = this.state.index;
    let currentDialog = this.state.dialog[index];
    let dialogLength = this.state.dialog.length;
    let nextDialog = this.state.dialog[index + 1];
    let npc = this.state.npc;

    if( currentDialog ){
    
      if( nextDialog && nextDialog.reveal && npc.name != nextDialog.reveal ){
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
      const inputFields = document.querySelectorAll("input")
      
      let userInput;
      if( inputFields.length > 1 ){
        userInput = `${inputFields[0].value}${inputFields[1].value}${inputFields[2].value}`;
        console.log(userInput);
      } else {
        userInput = document.querySelector("input").value
      }
      
      answer = userInput ? userInput : "Inget svar";
    }

    // Move players forward in story or give appropriate puzzlefeedback.
    let dialogDone = await this.markDialogDone(dialog, answer);
    if( dialogDone.ending )  localStorage.setItem("arg_ending", dialogDone.ending);
      console.log(dialog.camera);

      if ( dialog.chat ) document.querySelector("#chatNav").classList.add("notification");
      if( dialog.reward && dialog.type !== "puzzle"  ) document.querySelector("#inventoryNav").classList.add("notification");

      if( dialogDone.done ){
        console.log(dialog.camera)
        if( dialog.reward && dialog.type === "puzzle") document.querySelector("#inventoryNav").classList.add("notification");
        
        // See so there are more dialogs to continue to otherwise reset all states
        if( index < dialogLength){

          console.log(index);
          console.log(dialogLength);

          // Whole special case for the final dialogs;
          let userEnding = localStorage.getItem("arg_ending");
          console.log(userEnding)
          if( userEnding ){
            console.log("USER ENDING EXISTS");
            this.setState( {dialog: this.state.dialog.filter(dialog => dialog.ending == userEnding || dialog.ending == undefined )} , this.setState({index: this.state.index + 1}));
            localStorage.setItem("arg_tipIndex", "0");
            localStorage.removeItem("arg_puzzleTips");
            return;
          }
          localStorage.removeItem("arg_puzzleTips");
          localStorage.setItem("arg_tipIndex", 0);
          this.setState({index: this.state.index + 1});
          
          // Reset all states if there are no more dialogs
        } else {
          const placeID = this.state.place.id;
          const locations = this.state.locations;
          const newLocations = locations.filter( location => location.id != placeID );

          this.setState({
            playerIsNearLocation: false, 
            index: 0, place: {}, 
            dialog:{}, npc:{},
            answer: "",
            usingCamera: false
          });
        }
        localStorage.removeItem("arg_puzzleTips")
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
        tips: parseInt(localStorage.getItem("arg_tipIndex")) / 2,
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

  /**
   * Chooses the location depending on an ID.
   * @param {int} locationID
   * @returns 
   */
  locationHandler(locationID){
    let locations = this.state.locations;
    let choosenLocation = locations.find( location => location.id == locationID );
    return choosenLocation;
  }

  /**
   * Chooses puzzle accordingly to display
   * Needs to be a case each, because each puzzle has it's little nifty thing going on.
   * @param {object} puzzle 
   * @returns 
   */
  puzzleHandler(puzzle){
    let puzzleElement;
    switch (puzzle.id) {
      case "2":
        puzzleElement = <PuzzleBottle 
        image={puzzle.imageLink} 
        text={puzzle.text}
        handler={this.dialogHandler}
        />
        break;
    
      case "6":
        puzzleElement = <PuzzleRings 
        image={puzzle.imageLink}
        text={puzzle.text}
        answer={this.state.answer}
        handler={this.dialogHandler}
        video={this.removeVideoBackground}
        />
        break;

      case "12":
        puzzleElement = <PaperPickup 
        image={puzzle.imageLink}
        text={puzzle.text}
        answer={this.state.answer}
        handler={this.dialogHandler}
        video={this.removeVideoBackground}
        />
      break;

      case "15":
        puzzleElement = <PuzzleTrolls 
        image={puzzle.imageLink}
        text={puzzle.text}
        handler={this.dialogHandler}
        />
        break;

      case "19":
        puzzleElement = <RuneTranslation
        image={puzzle.imageLink}
        text={puzzle.text}
        handler={this.dialogHandler}
        video={this.removeVideoBackground}
        />
        break;
      
      case "22":
        puzzleElement = <AlvkungenRunes
        image={puzzle.imageLink}
        text={puzzle.text}
        handler={this.dialogHandler}
        video={this.removeVideoBackground}
        />
        break;

      case "28":
      case "31":
      case "34":
        puzzleElement = <AlvBattle
        image={puzzle.imageLink}
        itemImage={puzzle.itemImage}
        text={puzzle.text}
        handler={this.dialogHandler}
        />
        break;

      case "37":
        puzzleElement = <KvarnLock
        image={puzzle.imageLink}
        text={puzzle.text}
        handler={this.dialogHandler}
        video={this.removeVideoBackground}
        answer={this.state.answer}
        />
        break;
      default:
        break;
    }
    return puzzleElement;
  }

  /**
   * Gets all NPCS from database to use in final Scene.
   * @returns {array} Array of all NPCS in the game
   */
  async fetchNPCS(){
    const userID = this.state.user.id;
    const request = new Request(`https://dev.svnoak.net/api/inventory/npc/${userID}`);
    const response = await fetch(request);
    return await response.json();
  }

  loadingPlace(){
    let npc = { imageLink: "transparent.png" };
    let dialog = {
      type: "placeholder"
    };

    dialog.text = localStorage.getItem("arg_puzzleTips") ? "Öpnna kameran för att lösa gåtan" : "Du ser dig omkring";
    let element =
    <Dialog
      npc = {npc}
      handler = {this.dialogHandler}
      dialog = {dialog}
    />
    return element;
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
        console.log(currentDialog);
        // If there are dialogs/puzzles at the location, return elements accordingly
        if( currentDialog ){
          if( currentDialog.type == "dialog" || currentDialog.type == "info" ){

            // If dialog, check who speaks or if it's only an info dialog.
              if( this.state.place.id == "6" ){
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

                // Save puzzleTips so they can be retrieved in the chat
                let puzzleTips = currentDialog.tips;
                console.log(puzzleTips);
                let stringifiedTips = JSON.stringify(puzzleTips);
                localStorage.setItem("arg_puzzleTips", stringifiedTips);             
                }

              // Create some sort of notification and save newly income chat in localStorage
              else if( currentDialog.type == "chat" ){
                let chatMessages = this.state.dialog.filter( dialog => dialog.type == "chat" );
                let stringifiedChat = JSON.stringify(chatMessages);
                localStorage.setItem("arg_dialog", stringifiedChat);
                localStorage.setItem("arg_place", this.state.place.id);
                this.setState({usingCamera: false});
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
    /* let dialog = this.state.dialog;
    let index = this.state.index;
    let off = false;
    if( dialog && dialog[index] && dialog[index.type] == "chat" ) off = true; */
    return(
      <div id="cameraScene">
        <Waiting />
        { !this.state.usingCamera && <CameraPrompt track={this.startTracking.bind(this)}/>}
        {/* { this.state.usingCamera && this.state.dialog[this.state.index].type == "chat" && <CameraPrompt track={this.startTracking.bind(this)}/>} */}
        { !this.state.playerIsNearLocation && this.state.usingCamera && this.loadingPlace() }
        { this.state.playerIsNearLocation && this.state.usingCamera && this.displayElement() }
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

/**
 * Locationchanger for debug mode.
 * @param {object} props - this 
 * @returns 
 */
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

/**
 * Puts up a camera prompt so user needs to activate camera manually.
 * @param {object} props - this
 * @returns {HTML Element} 
 */
function CameraPrompt(props){
  let prompt = localStorage.getItem("arg_puzzleTips") ? "Titta på puzzlet" : "Se dig omkring"
  return(
    <div id="prompt" onClick={() => props.track()}>
      <div id="camera"></div>
      {prompt}
    </div>
  )
}
 
export default Camera;