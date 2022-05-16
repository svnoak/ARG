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

        { props.npc && props.npc.id == "2" && <a-image id="npc" src="#image" npc look-at="[camera]" position="4 0 -8" height="4" width="6" ></a-image> }
        { props.npc && props.npc.id == "3" && <a-image id="npc" src="#image" npc look-at="[camera]" position="0 0 -15" height="4" width="6" ></a-image> }
        { props.npc && props.npc.id == "4" && <a-image id="npc" src="#image" npc look-at="[camera]" position="-10 8 -20" height="4" width="6" ></a-image> }
        { props.npc && props.npc.id == "5" && <a-image id="npc" src="#image" npc look-at="[camera]" position="0 0 8" height="5" width="6" ></a-image> }
        { props.npc && props.npc.id == "8" && <a-image id="npc" src="#image" npc look-at="[camera]" position="16 0 -15" height="4" width="6" ></a-image> }

          
        <a-camera camera look-controls rotation-reader arjs-look-controls='smoothingFactor: 0.1'></a-camera>
            
          <div className="a-loader-title" style={{display: 'none'}}></div>
      </a-scene>
    {
    props.dialog ? 
    <div id="dialogBox" onClick={ () => {props.dialogHandler("trigger")} }>
        {speaker && <div className="speaker">{speaker}</div> }
        <div className={props.dialog.type}><span>{props.dialog.text}</span><span className="pulse"></span></div>
    </div>
    : <div></div>
    }
    <div id="camera"></div>
    </>
    )
  }

export default Dialog;