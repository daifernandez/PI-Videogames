import React from "react";
import { NavLink } from "react-router-dom";
import "./Styles/Card.css";
import banner from "../img/banner.jpg";

export default function Card({ videogame }) {
  return (
    <NavLink to={`/videogame/${videogame.id}`} className="card-link">
      <div 
        className="card"
        style={{
          backgroundImage: `url(${videogame.image ? videogame.image : banner})`
        }}
      >
        <div className="card-gradient">
          <div className="card-rating">
            <span className="rating-star">⭐</span>
            <span className="rating-number">{videogame.rating}</span>
          </div>
          <div className="card-content">
            <h3 className="card-title" title={videogame.name}>{videogame.name}</h3>
            <p className="card-genres" title={videogame.genres.join(" • ")}>{videogame.genres.join(" • ")}</p>
          </div>
        </div>
      </div>
    </NavLink>
  );
}
