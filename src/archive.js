import { Link } from "react-router-dom";


function Archive() {
  document.querySelector("#inventoryNav").classList.remove("notification")
  return (
   <div className="pageWrapper">
   <div className="archiveWrap">
      <Link to="/saker"><i class="zmdi zmdi-attachment-alt"></i><span>Saker</span></Link>
      <Link to="/platser"><i class="zmdi zmdi-compass"></i><span>Platser</span></Link>
      <Link to="/vasen"><i class="zmdi zmdi-male"></i><span>Väsen</span></Link>
    </div>
    </div>
  );
}

export default Archive;
