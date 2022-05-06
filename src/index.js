import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Chat from "./chat.js";
import Archive from "./archive.js";
import Camera from "./camera.js";
import NavBar from "./navBar.js";
import Login from "./login.js";
import Locations from "./locations.js";
import Creatures from "./creatures.js";
import Inventory from "./inventory.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/locations" element={<Locations />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/camera" element={<Camera />} />
      <Route path="/creatures" element={<Creatures />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
    <NavBar />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
