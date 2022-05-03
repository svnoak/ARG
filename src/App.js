import { Routes, Route, Link, Router } from "react-router-dom";
import Chat from "./chat.js";
import Inventory from "./inventory.js";
import Camera from "./camera.js";

function App() {
  return (
    <Router>
    <div className="App">
      <h1 className="hello">hemma</h1>
<Switch>
<Route exact path='/chat'><Chat /></Route>
<Route exact path='/inventory'><Inventory/></Route>
<Route exact path='/camera'><Camera/></Route>
</Switch>
    </div>
    </Router>
  );
}

export default App;
