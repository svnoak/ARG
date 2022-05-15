import React, { useState } from "react";
import { Link } from "react-router-dom";


const Creatures = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [viewer, setViewer] = useState([]);
  let loggedinUser = JSON.parse(localStorage.getItem("arg_user"))["id"];

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
    const item = getItem(propid);
    setViewer(item);
    setShow(true);
  }

  function getItem(id){
    return data.find( item => item.id == id );
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
                <img className="thumbnail" alt={"Thumbnail på " + prop.name}  src={"https://dev.svnoak.net/assets/images/" + prop.imageLink}/>
              </div>
            );
          })}
        </div>
      </div>
      <div className="viewpanel">
          {show ? (
            <img alt="Bild på väsen"
              visi
              src={"https://dev.svnoak.net/assets/images/" + viewer.imageLink}
            />
          ) : null}
        </div>
        <div className="textPanel">{viewer.infoText}</div>
    </div>
  );
};

export default Creatures;
