/**
 * Displays Dialog with ARjs
 * @param {object} props - Object for npc and dialog from state.npc and state.dialog
 * @returns 
 */
 function ARpuzzle(props) {
    console.log("PUZZLE TIME!");
    let speaker;
    if( props.dialog.speaker ){
      if( props.ncp ){
        speaker = props.dialog.speaker == "npc" ? props.npc.name : props.user.username;
      }
      speaker = "";
    }
      return (
      <>
        <a-scene id="ar-scene" vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
          <a-assets>
          {props.npc && <img id="image" crossOrigin="anonymous" src={"https://dev.svnoak.net/assets/images/" + props.npc.imageLink}></img>}
          </a-assets>
        
          {/* <a-plane onClick={() => props.dialogHandler("trigger")} id="target" color="blue" height="2" width="1" position="0 0 -5" ></a-plane> */}
          <a-image onClick={() => props.handler("trigger")} id="npc" src="#image" npc look-at="[camera]" position="0 -10 -1" height="2" width="1"></a-image>
            
          <a-camera camera look-controls rotation-reader arjs-look-controls='smoothingFactor: 0.1'>
    {/*           <a-entity cursor="fuse: true; fuseTimeout: 500"
                position="0 0 -1"
                geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
                material="color: black; shader: flat">
              </a-entity> */}
          </a-camera>
            <div className="a-loader-title" style={{display: 'none'}}></div>
        </a-scene>
      {
      props.dialog ? 
      <div id="dialogBox" onClick={ () => props.handler(props.dialog.types) }>
          <div className="speaker">{speaker}</div>
          <div className={props.dialog.type}>{props.dialog.text}</div>
      </div>
      : <div></div> 
      }
      </>
      )
    }
  
  export default ARpuzzle;