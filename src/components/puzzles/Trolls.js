import React, { createContext, useState } from 'react';

const AFRAME = window.AFRAME;
const THREE = window.THREE;
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

    const positions = [
      "3.243 0 -9.475",
      "-2.804 0 -6",
      "0 0 3.523",
      "0 4.536 -6",
      "-7.117 -0.599 -3.154",
      "6.797 0.245 -2.899",
      "6.275 2.113 2.876",
      "-6.494 2.980 -4.401",
      "-1.381 -1.573 -7.611",
      "-12.834 -2.749 5.287",
      "2.137 -7.380 -1.606"
    ]

    return (
    <>
      <a-scene id="ar-scene" vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
        <a-assets>
            { props.image.map((image, index) =>  <img id={"image" + index} key={index} crossOrigin="anonymous" src={"https://dev.svnoak.net/assets/images/" + image}></img> ) }
        </a-assets>

        { props.image.map((image, index) => <a-image key={index}  onClick={trollFound.bind(this)}  id="npc" src={"#image" + index } npc look-at="[camera]" position={positions[index]} height="2" width="1.3"></a-image> ) }
          
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

  

export default PuzzleTrolls;