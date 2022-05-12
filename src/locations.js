import React, { useState } from "react";

const Locations = () => {
  const [viewer, setViewer] = useState([]);
  const [data, setData] = useState([]);
  localStorage.setItem("id", "18");
  let loggedinUser = localStorage.getItem("id");

  if (data.length === 0) {
    getSomeData();
  }
  function getSomeData() {
    const request = new Request(
      "https://dev.svnoak.net/api/inventory/place/" + loggedinUser
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
           
            </div>
          );
        })}
      </div>
      <div className="viewpanel">
      <img
                alt ={viewer} src={"https://dev.svnoak.net/assets/images/" + viewer}
              />
      </div>
    </div>
  );
};

export default Locations;
