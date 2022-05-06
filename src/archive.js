import { Link } from "react-router-dom";

function Archive() {
  return (
    <nav className="navWrap">
      <Link to="/inventory">Inventory</Link>
      <Link to="/locations">Locations</Link>
      <Link to="/creatures">Creatures</Link>
    </nav>
  );
}

export default Archive;
