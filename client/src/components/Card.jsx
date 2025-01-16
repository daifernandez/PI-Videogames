import React from "react";
import { NavLink } from "react-router-dom";
import "./Styles/Card.css";
import banner from "../img/banner.jpg";

export default function Card({ videogame }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getGameStatus = () => {
    const releaseDate = new Date(videogame.released);
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    if (releaseDate > now) {
      return { class: 'coming-soon', text: 'Próximamente' };
    } else if (releaseDate > monthAgo) {
      return { class: 'new', text: 'Nuevo' };
    }
    return null;
  };

  const gameStatus = getGameStatus();

  return (
    <NavLink to={`/videogame/${videogame.id}`} className="card-link">
      <div 
        className="card"
        style={{
          backgroundImage: `url(${videogame.image ? videogame.image : banner})`
        }}
      >
        <div className="card-gradient">
          {gameStatus && (
            <div className={`game-status ${gameStatus.class}`}>
              {gameStatus.text}
            </div>
          )}
          
          <div className="card-rating">
            <span className="rating-star">⭐</span>
            <span className="rating-number">{videogame.rating}</span>
          </div>

          <div className="card-content">
            <h3 className="card-title" title={videogame.name}>{videogame.name}</h3>
            
            <div className="card-metadata">
              {videogame.released && (
                <span className="metadata-tag">
                  <svg className="calendar-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {formatDate(videogame.released)}
                </span>
              )}
            </div>

            <p className="card-genres" title={videogame.genres.join(" • ")}>
              {videogame.genres.join(" • ")}
            </p>
          </div>
        </div>
      </div>
    </NavLink>
  );
}
