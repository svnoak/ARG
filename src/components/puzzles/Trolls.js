import React, { createContext, useState } from 'react';

/**
 * Displays Dialog with ARjs
 * @param {object} props - Object for npc and dialog from state.npc and state.dialog
 * @returns 
 */
 function PuzzleTrolls(props) {
    const [count, setCount] = useState(0);
    console.log(count);
    if( count >= 11 ) props.handler();

    function trollFound(element){
        setCount(count+1);
        element.target.remove();
    }

    return (
    <>
      <a-scene id="ar-scene" vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
        <a-assets>
            { props.image.map((image, index) =>  <img id={"image" + index} key={index} crossOrigin="anonymous" src={"https://dev.svnoak.net/assets/images/" + image}></img> ) }
        </a-assets>

        { props.image.map((image, index) => <a-image key={index} onClick={trollFound.bind(this)} id="npc" src={"#image" + index } npc look-at="[camera]" position="0 0 -6" height="2" width="1"></a-image> ) }
          
        <a-camera camera look-controls rotation-reader arjs-look-controls='smoothingFactor: 0.1'>
        </a-camera>
          <div className="a-loader-title" style={{display: 'none'}}></div>
      </a-scene>
    <div id="dialogBox">
        <div className="info">{props.text}</div>
    </div>
    </>
    )
  }

  

export default PuzzleTrolls;