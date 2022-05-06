import './assets/css/camera.css';
import haversine from 'haversine-distance';
import React, { createContext, useState } from 'react';

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
      playerIsNearLocation: false
  }
    this.dialogHandler = this.dialogHanlder.bind(this);
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
    if( document.querySelector("video") != null )
      document.querySelector("video").remove();
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

  dialogHanlder(){
    console.log("DIALOG HANDLER");
    let index = this.state.index;
    let currentDialog = this.state.dialog[index];
    let dialogLength = this.state.dialog.length;

    if( currentDialog.markDone ){
      this.continueDialog(index, dialogLength, currentDialog.type);
      
    } else if(currentDialog.type == "puzzle"){
        this.continueDialog(index, dialogLength, currentDialog.type);
    }
      else{
      this.setState({index: this.state.index + 1});
    }
    
  }

  continueDialog(index, dialogLength, type, answer){
    if( index < dialogLength){
      this.setState({index: this.state.index + 1});
    } else {
      this.setState({ playerIsNearLocation: false, index: 0 });

    } 
  }

  removeVideoBackground(){

  }

  render(){

    /*
      This piece checks what kind of dialog is currently shown.
      It also sets if it is the dialog box with AR or the puzzle without the AR that should be shown.
    
      */
    const isAtLocation = this.state.playerIsNearLocation;
    let element;
    let currentDialog = "";
    if( isAtLocation ){
      if( this.state.dialog ) {
        currentDialog = this.state.dialog[this.state.index];
          if( currentDialog.type == "dialog" || currentDialog.type == "info" ){
            if( currentDialog.speaker ) currentDialog.speaker = currentDialog.speaker == "npc" ? this.state.npc.name : this.state.user.username;
            element = 
              <>
                <AR
                place = {this.state.place}
                npc = {this.state.npc}
                />
                <DialogBox
                handler = {this.dialogHandler}
                dialog = {currentDialog}
                />
              </>
          } else if( currentDialog.type == "puzzle"){
              if( document.querySelector("video") != null ){
                document.querySelector("video").remove();
              }
              
            element =
            <Puzzle 
              handler = {this.dialogHandler}
              dialog = {currentDialog}
              />
          }
        }
        
      }
      
    return(
      <div id="cameraScene">
        <Waiting />
        { element }
      </div>
    )
  }
}

function DialogButton(props){
  let text = props.type == "puzzle" ? "Ge svaret" : ">";
  return(
      <div className="dialogButton" onClick={ () => props.handler(props.type) }>{text}</div>
  )
}

function DialogBox(props){
  console.log(props.dialog);
  return(
    <div id="dialogBox" onClick={ () => props.handler(props.type) }>
      <div>{props.dialog.speaker}</div>
      <div className={props.dialog.type}>{props.dialog.text}</div>
    </div>
  )
}

function Puzzle(props){
  return(
    <div id="puzzleBox">
      <p className={props.dialog.type}>{props.dialog.text}</p>
      <input type="text"></input>
      <button onClick={ () => props.handler(props.type) }>Detta är mitt svar</button>
    </div>
  )
}

class AR extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    const AFRAME = window.AFRAME;
    return (
      <a-scene id="ar-scene" vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
      <a-assets>
       <img id="image" crossOrigin="anonymous" src={"https://dev.svnoak.net/assets/images/" + this.props.npc.imageLink}></img>
     </a-assets>
       <a-image clickhandler id="npc" src="#image" npc look-at="[camera]" position="0 0 -6" height="2" width="1"></a-image>

       <a-camera camera look-controls rotation-reader arjs-look-controls='smoothingFactor: 0.1'>
           {/* <a-entity geometry="primitive: ring; radiusInner: .5; radiusOuter: 8;" material="color: black; shader: flat;" position="0 0 -1"></a-entity> */}
           <a-entity cursor="fuse: true;" position="0 0 -1" geometry="primitive: circle; radius: .01" material="color: black; shader: flat; opacity: 0.2" raycaster=""></a-entity>
       </a-camera>  
           
 <div className="a-loader-title" style={{display: 'none'}}></div>
 </a-scene>
  );
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