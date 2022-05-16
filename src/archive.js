import { Link } from "react-router-dom";


function Archive() {
  if (document.querySelector("#inventoryNav")){
    document.querySelector("#inventoryNav").classList.remove("notification")
  }
  return (
   <div className="pageWrapper">
   <div className="archiveWrap">
      <Link to="/saker"><i className="zmdi zmdi-attachment-alt"></i><span>Saker</span></Link>
      <Link to="/platser"><i className="zmdi zmdi-compass"></i><span>Platser</span></Link>
      <Link to="/vasen"><i className="zmdi zmdi-male"></i><span>Väsen</span></Link>
    </div>
    </div>
  );
}

export default Archive;
