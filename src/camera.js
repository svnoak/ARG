import './assets/css/camera.css';
import haversine from 'haversine-distance';
import React, { createContext, useState } from 'react';

class Camera extends React.Component {
  constructor(props){
    super(props)
    localStorage.setItem("arg_userID", 1);
    this.state = {
      locations: JSON.parse(localStorage.getItem("locations")),
      place: null,
      npc: null,
      dialog: null,
      lat: "",
      lon: "",
      userID: localStorage.getItem("arg_userID"),
      playerIsNearLocation: false
  } 
}

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
    
    this.playerPosition = navigator.geolocation.watchPosition(this.success.bind(this), this.error);
    
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.playerPosition);
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
        console.log("Setting location data");
        await this.setPlaceState(location.id, this.state.userID);
        console.log("Location data set");
        console.log("Clearing Watch");
        navigator.geolocation.clearWatch(this.playerPosition);
        console.log("Watch cleared");
        console.log(this.state.dialog);
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

  render(){
    const isAtLocation = this.state.playerIsNearLocation;
    let ar;
    if( isAtLocation ){
      ar = <AR
            place = {this.state.place}
            npc = {this.state.npc}
          />
    } else{
      ar = "";
    }
    return(
      <div id="cameraScene">
        <Waiting />
        { ar }
        <DialogBox
          npc={this.state.npc}
          dialog = {this.state.dialog}
        />
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

function DialogBox(props){
  const dialog = props.dialog;
  const [index, setIndex] = useState(0);
  let currentDialog = "";
  if( dialog ) {
    currentDialog = dialog[index];
    if( currentDialog.type == "dialog" ){
      currentDialog.speaker = currentDialog.speaker == "npc" ? props.npc.name : "Kim";
    }
  }
  
  return(
    <div id="dialogBox">
      <p>{currentDialog.speaker}</p>
      <p className={currentDialog.type}>{currentDialog.text}</p>
      <button onClick={() => setIndex(index + 1)}>
        Next
      </button>
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
      <a-scene vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
      <a-assets>
       <img id="image" src={"https://dev.svnoak.net/assets/images/" + this.props.npc.imageLink}></img>
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
 
export default Camera;