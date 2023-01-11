import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Landing.css";
import "./Styles/Button.css";
import Logo from "../img/landing3.jpg";

export default function Landing() {
  return (
    <div className="landing">
      <div className="text">
        <h1>Videogames!</h1>
        <h4>PI - Henry Videogames</h4>{" "}
        <Link to="/home">
          <button className="custom-button">Home</button>
        </Link>
      </div>
      <img id="logo" src={Logo} className="logo" alt="" />
    </div>
  );
}
