import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Landing.css";
import "./Styles/Button.css";
import Logo from "../img/landing3.jpg";
import title from "../img/title.png";

export default function Landing() {
  return (
    <div>
      <div className="landing">
        <div className="contenedor-titulo">
          <img className="title" src={title} alt="" />
          <div className="data-contain">
            <Link to="/home">
              <button className="custom-button">Home</button>
            </Link>
          </div>
        </div>
        <img id="logo" src={Logo} className="logo" alt="" />
      </div>
      <label className="footnote">PI Henry - Videogames</label>
    </div>
  );
}
