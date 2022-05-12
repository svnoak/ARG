import React, { useState } from "react";

const Inventory = () => {
  const [data, setData] = useState([]);
  const [viewer, setViewer] = useState([]);
  localStorage.setItem("id", "18");
  let loggedinUser = localStorage.getItem("id");

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
    setViewer(data[propid - 1].imageLink);
  }

  return (
    <div className="wrapper">
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
      <div className="viewpanel"> <img
                alt ={viewer} src={"https://dev.svnoak.net/assets/images/" + viewer}
              /></div>
    </div>
  );
};

export default Inventory;
