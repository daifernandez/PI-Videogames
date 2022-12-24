import React from "react";
import { NavLink } from "react-router-dom";
import "./Styles/NavBar.css";

export default function NavBar() {
  return (
    <div className="contenedor">
      <p>Icono y Nombre de pagina</p>
      <NavLink to="/createVideogame">
        <button>Create Videogame</button>
      </NavLink>
    </div>
  );
}
