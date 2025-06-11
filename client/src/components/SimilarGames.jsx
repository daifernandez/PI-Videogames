import React from 'react';
import PropTypes from 'prop-types';
import { SiNintendogamecube } from 'react-icons/si';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { platformIcons } from '../utils/platformIcons';
import { FaCalendarAlt } from 'react-icons/fa';
import './Styles/RecentGames.css';
import './Styles/GameCardElements.css';
import { Link } from 'react-router-dom';

const SimilarGames = ({ games }) => {
  if (games.length === 0) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <section className="recent-games-container">
      <div className="recent-games-header">
        <h2>
          <span className="game-icon"><SiNintendogamecube /></span> 
          Similar Games 
          <span className="subtitle">Games you might like</span>
        </h2>
      </div>
      <div className="recent-games-grid">
        {games.map((game) => (
          <Link to={`/videogame/${game.id}`} key={game.id} className="game-card">
            <div className="game-card-image-container">
              <img 
                src={game.image} 
                alt={game.name}
                className="game-card-image"
                loading="lazy"
              />
              <div className="game-card-overlay">
                <span className="view-details">View details</span>
              </div>
            </div>
            <div className="game-card-content">
              <h3 className="game-card-title">{game.name}</h3>
              <div className="game-card-info">
                <div className="release-date" title={`Release date: ${formatDate(game.released)}`}>
                  <FaCalendarAlt className="date-icon" />
                  {formatDate(game.released)}
                </div>
              </div>
              {game.platforms && game.platforms.length > 0 && (
                <div className="game-card-platforms">
                  <div className="platforms-container">
                    {game.platforms.slice(0, 4).map((platform, index) => (
                      <span key={index} className="platform-icon" title={platform}>
                        <FontAwesomeIcon 
                          icon={platformIcons[platform] || platformIcons['Default']} 
                        />
                      </span>
                    ))}
                    {game.platforms.length > 4 && (
                      <span className="platform-icon more" title={`${game.platforms.length - 4} more platforms`}>
                        +{game.platforms.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

SimilarGames.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      rating: PropTypes.number,
      released: PropTypes.string.isRequired,
      platforms: PropTypes.arrayOf(PropTypes.string),
      genres: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            name: PropTypes.string.isRequired
          })
        ])
      ).isRequired
    })
  ).isRequired
};

export default SimilarGames; 
