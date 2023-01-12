import React from "react";
import { NavLink } from "react-router-dom";
import "./Styles/NavBar.css";
import Logo from "../img/navbar.png";
import "./Styles/Button.css";

export default function NavBar() {
  return (
    <div className="contenedor">
      <div className="img">
        <NavLink exact to="/home">
          <img id="logo" src={Logo} className="img" alt="" />
        </NavLink>
      </div>
      <NavLink to="/createVideogame">
        <button className="custom-button">
          <span class="material-symbols-rounded middle-align button-icon">
            add_to_photos
          </span>
          <span className="middle-align">Add Videogame</span>
        </button>
      </NavLink>
    </div>
  );
}
