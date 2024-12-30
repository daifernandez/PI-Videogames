import React from "react";
import "./Styles/Footer.css";
import Social from "./Social";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          Developed with <span className="footer-highlight">♥</span> by{" "}
          <span className="footer-highlight">Dai</span>
        </p>
        <Social />
      </div>
    </footer>
  );
}
