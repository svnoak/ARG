import './assets/css/camera.css';
import haversine from 'haversine-distance';
import React, { createContext, useState } from 'react';
import Dialog from "./components/Dialog";
import Textpuzzle from './components/Textpuzzle';
import ARpuzzle from './components/ARpuzzle';

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
      initialLocation: true
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

    const options = {
      enableHighAccuracy: true,
      timeout: 5000, 
      maximumAge: 0
    }
    
    /**
     * Gets Playerposition
     * @param {function} success - Runs the function if position was successfully determined
     * @param {function} error - Runs the callback for position not being retrieved
     */
    this.playerPosition = navigator.geolocation.watchPosition(this.success.bind(this), this.error);
    
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
    navigator.geolocation.clearWatch(this.playerPosition);
    this.removeVideoBackground();
  }

  /**
   * Checks if player is near any gamelocation and sets state accordingly.
   * @param {object} pos - Object that holds player coordinates
   */
  async success(pos){
    console.log("Getting position");
    let crd = pos.coords;
    const playerIsNearLocation  = await this.PlayerIsNearLocation(crd);
    this.setState({
      playerIsNearLocation: playerIsNearLocation,
      lat: crd.latitude,
      lon: crd.longitude
    });
  }

  /**
   * Checks if player geolocation is near any matching gamelocations.
   * @param {object} coords - Object that holds player coordinates
   * @returns {bool}
   */
  async PlayerIsNearLocation(coords){
    let playerLat = coords.latitude;
    let playerLon = coords.longitude
    if( this.debug ){
      playerLat = this.state.lat;
      playerLon = this.state.lon;
    }
    const playerLocation = { latitude: playerLat, longitude: playerLon };

    if( this.state.initialLocation ){
      await this.setPlaceState(10, this.state.user.id);
      navigator.geolocation.clearWatch(this.playerPosition);
      return true;
    }
    for( let location of this.state.locations ){
      const locationCoords = { latitude: location.latitude, longitude: location.longitude };
      const distance = haversine(playerLocation, locationCoords);
      if( distance < location.area ){
        await this.setPlaceState(location.id, this.state.user.id);
        navigator.geolocation.clearWatch(this.playerPosition);
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
    const request = new Request(`https://dev.svnoak.net/api/place/${placeID}/${userID}`);
    const response = await fetch(request);
    const json = await response.json();
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

    // Check what kind of dialog is shown.
    if(currentDialog.type == "puzzle"){
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
      if( dialogDone ){

        // See so there are more dialogs to continue to otherwise reset all states
        if( index < dialogLength){
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

  locationHandler(){
    let locationID = document.querySelector("#location").value;
    let locations = this.state.locations;
    let choosenLocation = locations.find( location => location.id == locationID );
    this.setState({lat: choosenLocation.latitude, lon: choosenLocation.longitude});
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
            console.log(currentDialog.speaker);
                element = <Dialog 
                npc = {this.state.npc}
                user = {this.state.user}
                dialog = {currentDialog}
                triggerHandler = {this.triggerHandler}
                dialogTriggered = {this.state.dialogTriggered} 
                dialogHandler = {this.dialogHandler}
                />;
              }

              // Set puzzle depending on textbased or AR.
              else if( currentDialog.type == "puzzle"){
                if( currentDialog.interaction == "text" ){
                  this.removeVideoBackground();
    
                  element =
                  <Textpuzzle
                    handler = {this.dialogHandler}
                    answer = {this.state.answer}
                    dialog = {currentDialog}
                    />
                } else {
                  let info = {
                    text: "TEXT",
                    sender: ""
                  };
                  <ARpuzzle
                  dialog={info} 
                  />
                }
                  
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
        { this.debug && <LocationList handler={this.locationHandler}/> }
        <Waiting />
        { this.displayElement() }
        { !this.state.playerIsNearLocation && this.emptyPlace() }
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
    <select name="locations" id="location" onChange={() => props.handler()}>
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
  )
}
 
export default Camera;