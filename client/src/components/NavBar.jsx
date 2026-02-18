import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clear } from "../Redux/actions";
import ThemeToggle from "./ThemeToggle";
import Tooltip from "./Tooltip";
import useTheme from "../hooks/useTheme";
import GamepadIcon from "./GamepadIcon";
import "./Styles/Button.css";
import "./Styles/NavBar.css";

export default function NavBar() {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrolled(currentScrollY > 10);

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleHomeClick = () => {
    dispatch(clear());
  };

  return (
    <nav
      className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${hidden ? "navbar--hidden" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar-content">
        <div className="navbar-left">
          <Tooltip text="Go to home" position="bottom">
            <NavLink
              to="/"
              onClick={handleHomeClick}
              className="logo-link"
              aria-label="GameStream — Go to home"
            >
              <GamepadIcon size={26} className="brand-icon" />
              <span className="brand-name navbar-brand">GameStream</span>
            </NavLink>
          </Tooltip>
        </div>

        <div className="navbar-right">
          <Tooltip text={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} position="bottom">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}
