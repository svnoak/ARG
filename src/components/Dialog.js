import {useState} from "react";

/**
 * Displays Dialog with ARjs
 * @param {object} props - Object for npc and dialog from state.npc and state.dialog
 * @returns 
 */
function Dialog(props) {
  console.log(props);

  let speaker;
  if( props.npc ){
    if( props.dialog.speaker ) speaker = props.dialog.speaker == "npc" ? props.npc.name : props.user.username;
  }
    return (
    <>
      <a-scene id="ar-scene" vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
        <a-assets>
        { props.npc &&  <img id="image" crossOrigin="anonymous" src={"https://dev.svnoak.net/assets/images/" + props.npc.imageLink}></img> }
        </a-assets>
      
        { props.npc && <a-image id="npc" src="#image" npc look-at="[camera]" position="0 0 -15" height="4" width="6" ></a-image> }
          
        <a-camera camera look-controls rotation-reader arjs-look-controls='smoothingFactor: 0.1'></a-camera>
            
          <div className="a-loader-title" style={{display: 'none'}}></div>
      </a-scene>
    {
    props.dialog ? 
    <div id="dialogBox" onClick={ () => {props.dialogHandler("trigger")} }>
        {speaker && <div className="speaker">{speaker}</div> }
        <div className={props.dialog.type}>{props.dialog.text}</div>
    </div>
    : <div></div>
    }
    <div id="camera"></div>
    </>
    )
  }

export default Dialog;