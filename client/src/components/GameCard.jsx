import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const GameCard = ({ game }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Link to={`/videogame/${game.id}`} className="game-card">
      <img 
        src={game.image} 
        alt={game.name}
        className="game-card-image"
        loading="lazy"
      />
      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        <div className="game-card-info">
          <div className="game-card-rating">
            ⭐ {game.rating?.toFixed(1) || '0.0'}
          </div>
          <div>{formatDate(game.released)}</div>
        </div>
        {game.genres && game.genres.length > 0 && (
          <div className="game-card-genres">
            {game.genres.slice(0, 3).map((genre, index) => (
              <span key={index} className="game-card-genre">
                {typeof genre === 'string' ? genre : genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number,
    released: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string.isRequired
        })
      ])
    ).isRequired
  }).isRequired
};

export default GameCard; 
