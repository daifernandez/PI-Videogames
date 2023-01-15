import React from "react";
import Card from "./Card.jsx";
import "./Styles/Cards.css";

export default function Cards({ videogames, direction }) {
  return (
    <div
      className={
        direction === "vertical"
          ? "cont-cards-vertical"
          : "cont-cards-horizontal"
      }
    >
      {videogames.map((videogame) => (
        <Card key={videogame.id} videogame={videogame} />
      ))}
    </div>
  );
}
