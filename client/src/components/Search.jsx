import React from "react";
import "./Styles/Search.css";

export default function Search() {
  return (
    <div>
      <input className="search-contenedor" type="text" placeholder="Videogame Name..."/>
      <button className="search-button">Search</button>
      <button className="search-button">Clear Search</button>
    </div>
  );
}
