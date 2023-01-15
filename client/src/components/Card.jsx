import React from "react";
import { NavLink } from "react-router-dom";
import "./Styles/Card.css";
import banner from "../img/banner.jpg";

export default function Card({ videogame }) {
  return (
    <NavLink to={`/videogame/${videogame.id}`}>
      <div className="celda">
        <div className="main-image">
          <img
            className="main-image"
            src={videogame.image ? videogame.image : banner}
            alt="img not found"
          />
        </div>
        <div className="text-box">
          <div className="text-info">
            <h4>{videogame.name}</h4>
            <p>{videogame.genres.join(" - ")}</p>
          </div>
          <div className="star-rating">
            <h4>⭐️ {videogame.rating}</h4>
          </div>
        </div>
      </div>
    </NavLink>
  );
}
