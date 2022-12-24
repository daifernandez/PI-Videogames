import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <h1>Videogames!</h1>
      <h4>PI - Henry Videogames</h4>
      <Link to="/home">
        <button>Home</button>
      </Link>
    </div>
  );
}
