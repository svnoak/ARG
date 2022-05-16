/**
 * Displays Dialog with ARjs
 * @param {object} props - Object for npc and dialog from state.npc and state.dialog
 * @returns 
 */
function Alvkungen(props) {
  console.log(props);
  let speaker;
  if( props.dialog.speaker ) speaker = props.dialog.speaker == "player" ? props.user.username : props.dialog.speaker;
    return (
    <>
      <a-scene id="ar-scene" vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
        <a-assets>
          { props.npc.map( (npc,index) => <img id={npc.id} key={index} crossOrigin="anonymous" src={"https://dev.svnoak.net/assets/images/" + npc.imageLink}></img> ) }
        </a-assets>
      

        { console.log(props.dialog.scene) }
        {props.dialog.scene != "final" && <a-image src="#4" npc look-at="[camera]" position="0 0 -10" height="2" width="2"></a-image> }
        {props.dialog.scene == "final" && <a-image src="#7" npc look-at="[camera]" position="0 0 -5" height="2" width="2"></a-image>}
        <a-camera camera look-controls rotation-reader arjs-look-controls='smoothingFactor: 0.1'>

        </a-camera>
            
          <div className="a-loader-title" style={{display: 'none'}}></div>
      </a-scene>
    {
    props.dialog ? 
    <div id="dialogBox" onClick={ () => props.dialogHandler('trigger') }>
        <div className="speaker">{speaker}</div>
        <div className={props.dialog.type}>{props.dialog.text}</div>
    </div>
    : <div></div> 
    }
    <div id="camera"></div>
    </>
    )
  }

export default Alvkungen;