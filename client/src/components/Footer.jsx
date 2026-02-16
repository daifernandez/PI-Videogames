import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clear } from "../Redux/actions";
import Social from "./Social";
import GamepadIcon from "./GamepadIcon";
import "./Styles/Footer.css";

export default function Footer() {
  const dispatch = useDispatch();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeClick = () => {
    dispatch(clear());
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-glow" aria-hidden="true" />

      <div className="footer-content">
        <div className="footer-section footer-brand-section">
          <NavLink to="/home" onClick={handleHomeClick} className="footer-brand-link">
            <GamepadIcon size={24} className="brand-icon" />
            <span className="brand-name footer-brand-name">GameStream</span>
          </NavLink>
          <p className="footer-tagline">
            Discover, explore and catalog your favorite videogames.
          </p>
        </div>

        <div className="footer-section footer-nav-section">
          <h3 className="footer-section-title">Navigation</h3>
          <nav className="footer-nav" aria-label="Footer navigation">
            <NavLink to="/home" onClick={handleHomeClick} className="footer-nav-link">
              Home
            </NavLink>
            <NavLink to="/createVideogame" className="footer-nav-link">
              Create Videogame
            </NavLink>
          </nav>
        </div>

        <div className="footer-section footer-social-section">
          <h3 className="footer-section-title">Connect</h3>
          <Social />
        </div>
      </div>

      <div className="footer-divider" aria-hidden="true" />

      <div className="footer-bottom">
        <p className="footer-text">
          Developed with <span className="footer-heart" aria-label="love">&#9829;</span> by{" "}
          <a
            href="https://daifernandez.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-author-link"
          >
            Dai
          </a>
        </p>
        <p className="footer-copyright">
          &copy; 2022 GameStream. All rights reserved.
        </p>
      </div>

      <button
        className={`back-to-top ${showBackToTop ? "back-to-top--visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        <span className="material-symbols-rounded" aria-hidden="true">keyboard_arrow_up</span>
      </button>
    </footer>
  );
}
