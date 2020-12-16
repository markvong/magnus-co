import React from "react";
import "./Landing.css";
const Landing = () => {
  const message = (
    <span style={{ fontWeight: "bold" }}>Adventure is out there.</span>
  );
  return (
    <div id="landing-container">
      <div id="title-div"></div>
      <h1 className="title">{message}</h1>
    </div>
  );
};

export default Landing;
