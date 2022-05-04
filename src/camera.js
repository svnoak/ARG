import './assets/css/camera.css';
import haversine from 'haversine-distance';
import React from 'react';

class Camera extends React.Component {
  constructor(props){
    super(props)
    localStorage.setItem("arg_userID", 1);
    this.state = {
      locations: JSON.parse(localStorage.getItem("locations")),
      currentPlace: "",
      userID: localStorage.getItem("arg_userID"),
      playerAtLocation: false
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
    navigator.geolocation.watchPosition(this.success.bind(this), this.error, options);

  }

  async initializeGameLocations(){
    const request = new Request(`https://dev.svnoak.net/api/place`);
    const response = await fetch(request);
    const json = await response.json();
    localStorage.setItem("locations", JSON.stringify(json));
    this.setState({locations: JSON.parse(localStorage.getItem("locations"))});
  }

  async success(pos){
    let crd = pos.coords;
    const playerIsNearLocation  = await this.PlayerIsNearLocation(crd);
    this.setState({playerAtLocation: playerIsNearLocation});
    console.log(this.state.playerAtLocation);
  }

  async PlayerIsNearLocation(coords){
    const playerLocation = { latitude: "55.599945", longitude: "13.005303" };
    for( let location of this.state.locations ){
      const locationCoords = { latitude: location.latitude, longitude: location.longitude };
      const distance = haversine(playerLocation, locationCoords);
      if( distance < location.area ){
        await this.setPlaceState(location.id, this.state.userID);
        return true;
      }
    } 
    return false
  }

  error(err){
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  async setPlaceState(placeID, userID){
    const request = new Request(`https://dev.svnoak.net/api/place/${placeID}/${userID}`);
    const response = await fetch(request);
    const json = await response.json();
    this.setState({currentPlace: json});
  }

  render(){
    const isAtLocation = this.state.playerAtLocation;
    let ar;
    const data = this.state.currentPlace;
    if( isAtLocation ){
      ar = <AR
            place = {data.place}
            npc = {data.npc}
            dialog = {data.dialog}
          />
    } else{
      ar = "";
    }
    return(
      <div id="cameraScene">
        <Waiting />
        { ar }
        <DialogBox />
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

function DialogBox(){
  return(
    <div id="dialogBox">
      <p id="longitude"></p>
      <p id="latitude"></p>
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
      <a-scene  vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
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