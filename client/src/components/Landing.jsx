import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Landing.css";
import "./Styles/Button.css";
import Logo from "../img/landing3.jpg";
import image from "../img/landing5.jpg";
import image2 from "../img/landing2.jpg";
import title from "../img/title.png";
import Footer from "./Footer";

export default function Landing() {
  return (
    <div>
      <div className="landing">
        <div className="contenedor-titulo">
          <h3>Welcome to</h3>
          <img className="title" src={title} alt="" />
          <p>Search your favorite games online</p>
          <div className="data-contain">
            <Link to="/home">
              <button className="custom-button">Get Started</button>
            </Link>
          </div>
        </div>
        <img id="logo" src={Logo} className="logo" alt="" />
      </div>

      {/* <div className="landing2">
        <div className="contenedor-text">
          <h3>What is GameStream?</h3>
          <p className="text-info">
            GameStream is a web application that allows you to search for
            videogames. You can also create your own videogame and add it to the
            database.
          </p>
        </div>
        <div className="contenedor-img">
          <img id="imageLanding" src={image} className="img-landing" alt="" />
          <img id="imageLanding2" src={image2} className="img-landing" alt="" />
        </div>
      </div> */}
      <Footer />
    </div>
  );
}
