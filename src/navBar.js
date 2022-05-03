import { Link } from "react-router-dom";

function navBar() {
    return (
        <nav className="navWrap">
    <Link to="/">chat</Link>
    <Link to="/camera">camera</Link>
    <Link to="/inventory">inventory</Link>
    </nav>
    );
  }
  
  export default navBar;
  