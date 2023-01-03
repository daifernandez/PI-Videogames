import React from "react";
import { NavLink } from "react-router-dom";
import "./Styles/NavBar.css";
import Logo from "../img/Icon.jpeg";
import "./Styles/Button.css";

export default function NavBar() {
  return (
    <div className="contenedor">
      <div className="img">
        <img id="logo" src={Logo} className="img" alt="" />
      </div>
      <NavLink to="/createVideogame">
        <button className="custom-button"> + Create Videogame</button>
      </NavLink>
    </div>
  );
}
