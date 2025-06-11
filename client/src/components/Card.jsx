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
  const rating = parseFloat(videogame.rating).toFixed(1);

  return (
    <NavLink to={`/videogame/${videogame.id}`} className="card-link">
      <article 
        className="card"
        style={{
          backgroundImage: `url(${videogame.image ? videogame.image : banner})`
        }}
      >
        <div className="card-gradient">
          <div className="card-header">
            {gameStatus && (
              <div className={`game-status ${gameStatus.class}`}>
                <span className="status-dot"></span>
                {gameStatus.text}
              </div>
            )}
            
            <div className="card-rating" title={`Calificación: ${rating}/5`}>
              <svg className="rating-star" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 8.5L21.5 9.5L16.5 14L18 21L12 17.5L6 21L7.5 14L2.5 9.5L9.5 8.5L12 2Z" 
                  fill="currentColor" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="rating-number">{rating}</span>
            </div>
          </div>

          <div className="card-content">
            <h3 className="card-title" title={videogame.name}>
              {videogame.name}
            </h3>
            
            <div className="card-metadata">
              {videogame.released && (
                <span className="metadata-tag">
                  <svg className="calendar-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {formatDate(videogame.released)}
                </span>
              )}
              
              {videogame.genres?.length > 0 && (
                <span className="genres-tag">
                  <svg className="genres-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.3 12.23h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65c-.44-.89-1.31-1.43-2.29-1.43H2.7c-.39 0-.7.31-.7.7v3.26C2 19.83 4.18 22 7.82 22h8.38c3.43 0 5.54-1.88 5.8-5.22v-3.85c0-.38-.31-.7-.7-.7ZM12.75 2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2h1.5V2Z" fill="currentColor"/>
                    <path d="M22 9.81v1.04a.7.7 0 0 1-.7.7h-3.48c-.98 0-1.85.54-2.29 1.42l-.84 1.66c-.2.4-.6.65-1.04.65h-3.28c-.31 0-.75-.07-1.04-.65l-.84-1.65c-.44-.89-1.31-1.43-2.29-1.43H2.7a.7.7 0 0 1-.7-.7V9.81C2 6.17 4.17 4 7.81 4h8.38C19.83 4 22 6.17 22 9.81Z" fill="currentColor"/>
                  </svg>
                  {videogame.genres.slice(0, 2).join(" • ")}
                  {videogame.genres.length > 2 && (
                    <span className="more-genres" title={videogame.genres.join(" • ")}>
                      +{videogame.genres.length - 2}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </NavLink>
  );
}
