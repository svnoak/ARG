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

  async componentDidMount(){
    console.log("MOUNTING");
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
    
    this.playerPosition = navigator.geolocation.watchPosition(this.success.bind(this), this.error);
    
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.playerPosition);
    this.removeVideoBackground();
    console.log("UNMOUNT");
  }

  async initializeGameLocations(){
    const request = new Request(`https://dev.svnoak.net/api/place`);
    const response = await fetch(request);
    const json = await response.json();
    localStorage.setItem("locations", JSON.stringify(json));
    this.setState({locations: JSON.parse(localStorage.getItem("locations"))});
  }

  async success(pos, playerPosition){
    console.log("Getting position");
    let crd = pos.coords;
    const playerIsNearLocation  = await this.PlayerIsNearLocation(crd, playerPosition);
    this.setState({
      playerIsNearLocation: playerIsNearLocation,
      lat: crd.latitude,
      lon: crd.longitude
    });
  }

  async PlayerIsNearLocation(coords){
    const playerLocation = { latitude: "55.605918", longitude: "13.025046" };
    for( let location of this.state.locations ){
      const locationCoords = { latitude: location.latitude, longitude: location.longitude };
      const distance = haversine(playerLocation, locationCoords);
      if( distance < location.area ){
        await this.setPlaceState(location.id, this.state.user.id);
        console.log("PLAYER IN LOCATION");
        navigator.geolocation.clearWatch(this.playerPosition);
        return true;
      }
    }
    return false
  }

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

  error(err){
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }


  /*
    @param triggerType string
    Checks if the trigger comes from a puzzle or a dialog
    and forwards Player accordingly.
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

  async setDialog(index, dialogLength, dialog, answer = ""){
    if( document.querySelector("input") != null ){
      let userInput = document.querySelector("input").value
      answer = userInput ? userInput : "Inget svar"; 
    }
    let dialogDone = await this.markDialogDone(dialog, answer);
      if( dialogDone ){
        if( index < dialogLength){
          console.log("Add to index");
          this.setState({index: this.state.index + 1});
        } else {
          this.setState({ playerIsNearLocation: false, index: 0 });
        }
      } else {
        this.setState({answer: answer});
      }
  }

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

  removeVideoBackground(){
    console.log("REMOVING BACKGROUND");
    if(document.querySelector("video") != null){
      document.querySelectorAll("video").forEach(video => video.remove());
    }
  }

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

function Waiting(){
  return(
    <div id="waiting">
      Initializing Locations
    </div>
  )
}
 
export default Camera;