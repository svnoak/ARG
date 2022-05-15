import { Link } from "react-router-dom";

function navBar() {
  return (
    <nav className="navWrap">
      <Link to="/"><i class="zmdi zmdi-comments"></i></Link>
      <Link to="/camera"><i class="zmdi zmdi-camera"></i></Link>
      <Link to="/anteckningar"><i class="zmdi zmdi-collection-bookmark"></i></Link>
    </nav>
  );
}

export default navBar;
