const Camera = () => {
    AFRAME.registerComponent('findtroll', {
        init: function () {
          let el = this.el;
          el.addEventListener('click', function () {            
           console.log("found " + el.id);

           /*FUNCTION TO ADD TROLL TO FOUND ARRAY, IF ALL FOUND TRIGGER NEXT DIALOGE!*/
           if (this.parentNode != null) el.remove();
          });
        }
      });

    return (
    <>
        <a-scene arjs="sourceType: webcam; debugUIEnabled: false;" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="" aframe-inspector-removed-embedded="undefined" cursor="rayOrigin: mouse">
            <a-image id="1" findtroll="" src="assets/asset.png" look-at="[camera]" position="0 0 -6" scale="" material="" geometry=""></a-image>
            <a-image id="2" findtroll="" src="assets/asset.png" look-at="[camera]" position="0 0 6" scale="" material="" geometry=""></a-image>

            <a-camera look-controls rotation-reader arjs-look-controls='smoothingFactor: 0.1'>
                <a-entity geometry="primitive: ring; radiusInner: .5; radiusOuter: 8;" material="color: black; shader: flat;" position="0 0 -1"></a-entity>
                <a-entity cursor="fuse: false;" position="0 0 -1" geometry="primitive: circle; radius: .01" material="color: black; shader: flat; opacity: 0.2" raycaster=""></a-entity>  
            </a-camera>
              
    <div class="a-loader-title" style="display: none;"></div>
    </a-scene>
    </>
     );
}
 
export default Camera;