import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Card.css";

export default function Card({ videogame }) {
  return (
    <div className="celda">
      <div className="main-image">
        <img
          className="main-image"
          src={videogame.image ? videogame.image : "https://google.com"}
          alt="img not found"
        />
      </div>
      <div>
        <div className="title">
          <Link to={`videogame/${videogame.id}`}>{videogame.name}</Link>
        </div>
        <h6>{videogame.rating}</h6>
        <p>{videogame.genres.join(", ")}</p>
      </div>
    </div>
  );
}
