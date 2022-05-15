import { Link } from "react-router-dom";

function navBar() {
  return (
    <nav className="navWrap">
      <Link to="/"><i class="zmdi zmdi-comments zmdi-hc-2x"></i></Link>
      <Link to="/camera"><i class="zmdi zmdi-camera zmdi-hc-2x"></i></Link>
      <Link to="/anteckningar"><i class="zmdi zmdi-collection-bookmark zmdi-hc-2x"></i></Link>
    </nav>
  );
}

export default navBar;
