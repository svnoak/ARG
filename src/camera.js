import './assets/css/camera.css';
import haversine from 'haversine-distance';
import React, { createContext, useState } from 'react';
import Dialog from "./components/Dialog";
import Textpuzzle from './components/Textpuzzle';

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
      answer: ""
  }
    this.dialogHandler = this.dialogHandler.bind(this);
}

  /**
   * Gets userPosition and initializes locations on first startup.
   * Shows waiting element if Locations are still initialized.
   */
  async componentDidMount(){
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
   * Removes the videobackground that ARjs places when moving to different page.
   */
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.playerPosition);
    this.removeVideoBackground();
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
    const playerLocation = { latitude: "55.605918", longitude: "13.025046" };

    
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
    if(currentDialog.type == "puzzle"){
      this.setDialog(index, dialogLength, currentDialog);
    } else if( index == 0 && triggerType != "trigger" ){
      } else {
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
    if( document.querySelector("input") != null ){
      let userInput = document.querySelector("input").value
      answer = userInput ? userInput : "Inget svar"; 
    }
    let dialogDone = await this.markDialogDone(dialog, answer);
      if( dialogDone ){
        if( index < dialogLength){
          this.setState({index: this.state.index + 1});
        } else {
          this.setState({ playerIsNearLocation: false, index: 0 });
        }
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
   * Conditianlly displays puzzle or dialog to player
   * @returns {HTMLElement}
   */
  displayElement(){
    console.log("RUNNING displayElement()")
    const isAtLocation = this.state.playerIsNearLocation;
    let element;
    let currentDialog = "";
    if( isAtLocation ){
      if( this.state.dialog ) {
        currentDialog = this.state.dialog[this.state.index];
        if( currentDialog ){
          if( currentDialog.type == "dialog" || currentDialog.type == "info" ){
            if( currentDialog.speaker ) currentDialog.speaker = currentDialog.speaker == "npc" ? this.state.npc.name : this.state.user.username;
                element = <Dialog 
                npc = {this.state.npc}
                dialog = {currentDialog}
                triggerHandler = {this.triggerHandler} 
                dialogTriggered = {this.state.dialogTriggered} 
                dialogHandler = {this.dialogHandler}
                />;
              }
              else if( currentDialog.type == "puzzle"){
                  this.removeVideoBackground();
    
                  element =
                  <Textpuzzle
                    handler = {this.dialogHandler}
                    answer = {this.state.answer}
                    dialog = {currentDialog}
                    />
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
        { this.displayElement() }
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
 
export default Camera;