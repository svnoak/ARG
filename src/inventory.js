import React, { useState } from "react";
import { Link } from "react-router-dom";

const Inventory = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [viewer, setViewer] = useState([]);
  let loggedinUser = JSON.parse(localStorage.getItem("arg_user"))["id"];

  if (data.length === 0) {
    getSomeData();
  }
  function getSomeData() {
    const request = new Request(
      "https://dev.svnoak.net/api/inventory/item/" + loggedinUser
    );
    fetch(request)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }

  function buttonClick(propid) {
    setViewer(data[propid - 1]);
    setShow(true);
  }

  return (
    <div className="pageWrapper">
      <div className="back-arrow"><Link to="/anteckningar"><i className="zmdi zmdi-arrow-left zmdi-hc-2x"></i></Link></div>
      <div className="buttonWrapper">
        <div className="buttongrid">
          {data.map(function (prop) {
            return (
              <div
                key={prop.id}
                onClick={() => {
                  buttonClick(prop.id);
                }}
                className="buttons"
              >
                {prop.name}
              </div>
            );
          })}
        </div>

        <div className="viewpanel">
          {show ? (
            <img alt="Bild på föremål"
              visi
              src={"https://dev.svnoak.net/assets/images/" + viewer.imageLink}
            />
          ) : null}
        </div>
        <div className="textPanel">{viewer.infoText}</div>
      </div>
    </div>
  );
};

export default Inventory;
