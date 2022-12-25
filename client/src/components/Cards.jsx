import React from "react";
import Card from "./Card.jsx";
import "./Styles/Cards.css";

export default function Cards({ videogames }) {
  return (
    <div className="cont">
      {videogames.map((videogame) => (
        <Card key={videogame.id} videogame={videogame} />
      ))}
    </div>
  );
}
