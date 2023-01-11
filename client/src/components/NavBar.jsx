import React from "react";
import { NavLink } from "react-router-dom";
import "./Styles/NavBar.css";
import Logo from "../img/icono.png";
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
        <button className="custom-buttonIcon">
          <div className="icon-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="icon-button"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add Videogame
          </div>
        </button>
      </NavLink>
    </div>
  );
}
