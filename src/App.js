import { useEffect, useState } from "react";
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
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/inventory" element={<Inventory />} />
    </Routes>
    <NavBar />
    </BrowserRouter>  
  </> }
  </>
  );
}

export default App;
