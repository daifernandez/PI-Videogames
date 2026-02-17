import React, { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ImagePlaceholder from "./ImagePlaceholder.jsx";
import "./Styles/Card.css";
import banner from "../img/banner.jpg";

export default function Card({ videogame }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      sessionStorage.setItem("homeScrollY", String(window.scrollY));
      navigate(`/videogame/${videogame.id}`, {
        state: { fromHome: true },
      });
    },
    [navigate, videogame.id]
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getLabel = () => {
    const releaseDate = new Date(videogame.released);
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    if (releaseDate > now) return { class: 'label-soon', text: 'Soon' };
    if (releaseDate > monthAgo) return { class: 'label-new', text: 'New' };
    if (parseFloat(videogame.rating) >= 4.5) return { class: 'label-top', text: 'Top rated' };
    return null;
  };

  const label = getLabel();
  const rating = parseFloat(videogame.rating).toFixed(1);

  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    imageRef.current.style.transform = `scale(1.04) translate(${x * -4}px, ${y * -4}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.style.transform = 'scale(1) translate(0, 0)';
    }
  }, []);

  return (
    <a
      href={`/videogame/${videogame.id}`}
      className="card-link"
      aria-label={`${videogame.name} — Rating ${rating}`}
      onClick={handleClick}
    >
      <article
        className="card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-bg-image" ref={imageRef}>
          <ImagePlaceholder
            src={videogame.image || banner}
            alt={videogame.name}
            name={videogame.name}
            className="card-bg-image__img"
          />
        </div>

        <div className="card-overlay" />

        <div className="card-inner">
          <div className="card-top">
            {label && (
              <span className={`card-label ${label.class}`}>{label.text}</span>
            )}
            <span className="card-rating">{rating}</span>
          </div>

          <div className="card-bottom">
            <h3 className="card-title">{videogame.name}</h3>
            <div className="card-meta">
              {videogame.released && (
                <span className="card-date">{formatDate(videogame.released)}</span>
              )}
              {videogame.genres?.length > 0 && (
                <span className="card-genre">
                  {videogame.genres.slice(0, 2).join(" · ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}
