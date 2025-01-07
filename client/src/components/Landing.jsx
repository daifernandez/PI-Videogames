import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Landing.css";
import "./Styles/Button.css";
import Logo from "../img/landing.png";
import title from "../img/title.png";
import Footer from "./Footer";


export default function Landing() {
  return (
    <div>
      <div className="landing">
        <div className="contenedor-titulo">
          <h3>Welcome to</h3>
          <img className="title" src={title} alt="GameStream Logo" />
          <p className="landing-description">
            Your ultimate portal for games
          </p>
          <p className="landing-description">
            Explore a massive library of games, discover new titles, 
            filter by your favorite genres, and join our community to 
            create and share your own creations.
          </p>
          <div className="data-contain">
            <Link to="/home">
              <button className="custom-button">Start</button>
            </Link>
          </div>
        </div>
        <img id="logo" src={Logo} className="logo" alt="" />
      </div>
      <Footer />
    </div>
  );
}
