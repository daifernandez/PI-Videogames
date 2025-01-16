import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clear } from "../Redux/actions";
import Logo from "../img/navbar.png";
import "./Styles/Button.css";
import "./Styles/NavBar.css";

export default function NavBar() {
  const dispatch = useDispatch();

  const handleHomeClick = () => {
    dispatch(clear());
  };

  return (
    <div className="contenedor">
      <div className="img">
        <NavLink to="/home" onClick={handleHomeClick}>
          <img id="logo" src={Logo} className="img" alt="" />
        </NavLink>
      </div>
      <NavLink to="/createVideogame">
        <button className="custom-button">
          <span className="material-symbols-rounded middle-align button-icon">
            add_to_photos
          </span>
          <span className="middle-align button-text-large">Add Videogame</span>
          <span className="middle-align button-text-small">Add</span>
        </button>
      </NavLink>
    </div>
  );
}
