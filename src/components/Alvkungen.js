/**
 * Displays Dialog with ARjs
 * @param {object} props - Object for npc and dialog from state.npc and state.dialog
 * @returns 
 */
function Alvkungen(props) {
  console.log(props);
  let speaker;
  if( props.dialog.speaker ) speaker = props.dialog.speaker == "npc" ? props.npc.name : props.user.username;
    return (
    <>
      <a-scene id="ar-scene" vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
        <a-assets>
          { props.npc.map( (npc,index) => <img id={npc.id} key={index} crossOrigin="anonymous" src={"https://dev.svnoak.net/assets/images/" + npc.imageLink}></img> ) }
        </a-assets>
      


        <a-image src="#6" npc look-at="[camera]" position="0 0 -4" height="2" width="1"></a-image>
        <a-image src="#8" npc look-at="[camera]" position="-3 0 -10" height="2" width="1"></a-image>
        <a-image src="#4" npc look-at="[camera]" position="-1.8 1 -10" height="1" width=".5"></a-image>
        <a-image src="#4" npc look-at="[camera]" position="-4 1.5 -13" height="1" width=".5"></a-image>
        <a-image src="#4" npc look-at="[camera]" position="-4 1 -10" height="1" width=".5"></a-image>

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