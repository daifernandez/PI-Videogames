import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clear } from "../Redux/actions";
import ThemeToggle from "./ThemeToggle";
import useTheme from "../hooks/useTheme";
import Logo from "../img/navbar.png";
import "./Styles/Button.css";
import "./Styles/NavBar.css";

export default function NavBar() {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const handleHomeClick = () => {
    dispatch(clear());
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <NavLink to="/home" onClick={handleHomeClick} className="logo-link">
            <img src={Logo} className="navbar-logo" alt="Logo" />
          </NavLink>
        </div>

        <div className="navbar-right">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <NavLink to="/createVideogame" className="nav-link create-button">
            <span className="material-symbols-rounded">add_to_photos</span>
            <span className="button-text-large">Add Videogame</span>
            <span className="button-text-small">Add</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
