import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Chat from "./chat.js";
import Inventory from "./inventory.js";
import Camera from "./camera.js";
import NavBar from "./navBar.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>

    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/camera" element={<Camera />} />
    </Routes>
 <NavBar /> 
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

