import React from 'react';
import PropTypes from 'prop-types';
import { SiNintendogamecube } from 'react-icons/si';
import GameCard from './GameCard';

const SimilarGames = ({ games }) => {
  if (games.length === 0) return null;

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
          <GameCard key={game.id} game={game} />
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
