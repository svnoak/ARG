import React, { useState } from "react";

const Creatures = () => {
  const [data, setData] = useState([]);
  const [viewer, setViewer] = useState([]);
  localStorage.setItem("id", "18");
  let loggedinUser = localStorage.getItem("id");

  if (data.length === 0) {
    getSomeData();
  }
  function getSomeData() {
    const request = new Request(
      "https://dev.svnoak.net/api/inventory/npc/" + loggedinUser
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
              <p>{prop.name}</p>
      
            </div>
          );
        })}
      </div>
      <div className="viewpanel">
      <img
                src={"https://dev.svnoak.net/assets/images/" + viewer}
              />
      </div>
    </div>
  );
};

export default Creatures;
