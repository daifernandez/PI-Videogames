import React from "react";
import { NavLink } from "react-router-dom";

export default function CreateVideogame() {
  return (
    <div>
      <NavLink exact to="/home">
        <button> Return</button>
      </NavLink>
      <h1>Formulario de creacion de videojuego</h1>
      
    </div>
  );
}
