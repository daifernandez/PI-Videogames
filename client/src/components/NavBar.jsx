import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clear } from "../Redux/actions";
import ThemeToggle from "./ThemeToggle";
import Tooltip from "./Tooltip";
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
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-content">
        <div className="navbar-left">
          <Tooltip text="Go to home" position="bottom">
            <NavLink to="/home" onClick={handleHomeClick} className="logo-link" aria-label="GameStream — Go to home">
              <img src={Logo} className="navbar-logo" alt="GameStream logo" />
            </NavLink>
          </Tooltip>
        </div>

        <div className="navbar-right">
          <Tooltip text={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} position="bottom">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </Tooltip>
          <NavLink to="/createVideogame" className="nav-link create-button" aria-label="Create a new videogame">
            <span className="material-symbols-rounded" aria-hidden="true">add_to_photos</span>
            <span className="button-text-large">Add Videogame</span>
            <span className="button-text-small" aria-hidden="true">Add</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
