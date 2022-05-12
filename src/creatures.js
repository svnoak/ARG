import React, { useState } from "react";

const Creatures = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
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
    setViewer(data[propid - 1]);
    setShow(true);
  }

  return (
    <div className="pageWrapper">
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
            <img
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

export default Creatures;
