import { Link } from "react-router-dom";

function Archive() {
  return (
   <div className="pageWrapper">
   <div className="archiveWrap">
      <Link to="/inventory">Inventory</Link>
      <Link to="/locations">Locations</Link>
      <Link to="/creatures">Creatures</Link>
    </div>
    </div>
  );
}

export default Archive;
