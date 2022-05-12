import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
  } from "react-router-dom";
import Chat from "./chat.js";
import Archive from "./archive.js";
import Camera from "./camera.js";
import NavBar from "./navBar.js";
import Login from "./login.js";
import Locations from "./locations.js";
import Creatures from "./creatures.js";
import Inventory from "./inventory.js";

function App() {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        localStorage.getItem("arg_user") ? setLoggedIn(true) : setLoggedIn(false);
    })

    function loginUser(userData){
      localStorage.setItem("arg_user", JSON.stringify(userData));
      setLoggedIn(true);
    }

  return (
      <>
    { !loggedIn && <Login loginHandler={loginUser}/> }
    { loggedIn &&
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/creatures" element={<Creatures />} />
        <Route path="/inventory" element={<Inventory />} />
    </Routes>
    <NavBar />
    </BrowserRouter>  
  </> }
  </>
  );
}

export default App;