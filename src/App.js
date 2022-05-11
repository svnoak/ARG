import { React, useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
  } from "react-router-dom";
import Chat from "./chat.js";
import NavBar from "./navBar.js";
import Inventory from "./inventory.js";
import Login from "./components/Login";
import Camera from "./camera.js";

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
        <Route path="/camera" element={<Camera />} />
        <Route path="/inventory" element={<Inventory />} />
    </Routes>
    <NavBar />
    </BrowserRouter>  
  </> }
  </>
  );
}

export default App;
