import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Card.css";

export default function Card() {
  return (
    <div className="celda">
      <div className="main-image">
       <h2>imagen</h2>
      </div>
      <div className="title">
        <Link to={"videogame/:id"}>
          Name
        </Link>
        <div>
          <h5>genero</h5>
        </div>
      </div>
    </div>
  );
}
