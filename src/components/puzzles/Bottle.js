/**
 * Displays Dialog with ARjs
 * @param {object} props - Object for npc and dialog from state.npc and state.dialog
 * @returns 
 */
 function PuzzleBottle(props) {
      return (
      <>
        <a-scene id="ar-scene" vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
          <a-assets>
          <img id="image" crossOrigin="anonymous" src={"https://dev.svnoak.net/assets/images/" + props.image}></img>
          
          </a-assets>

          <a-image onClick={() => props.handler("trigger")} id="npc" src="#image" look-at="[camera]" position="0 -10 -1" height="10" width="5"></a-image>
            
          <a-camera camera look-controls rotation-reader arjs-look-controls='smoothingFactor: 0.1'>
          </a-camera>
            <div className="a-loader-title" style={{display: 'none'}}></div>
        </a-scene>
      <div id="dialogBox">
          <div className="info">{props.text}</div>
      </div>
      <div id="camera"></div>
      </>
      )
    }
  
  export default PuzzleBottle;