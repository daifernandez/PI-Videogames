import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ImagePlaceholder from "./ImagePlaceholder.jsx";
import "./Styles/SimilarGames.css";

const SimilarGames = ({ games }) => {
  if (!games || games.length === 0) {
    return (
      <div className="sg-empty">
        <span className="material-symbols-rounded sg-empty__icon">
          sports_esports
        </span>
        <p className="sg-empty__text">No similar games found</p>
      </div>
    );
  }

  return (
    <section className="sg">
      <h2 className="sg__title">Similar Games</h2>
      <motion.div
        className="sg__grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <Link to={`/videogame/${game.id}`} className="sg__card">
              <div className="sg__image-wrapper">
                <ImagePlaceholder
                  src={game.image || null}
                  alt={game.name}
                  name={game.name}
                  className="sg__image"
                />
                <div className="sg__image-overlay" />
              </div>
              <div className="sg__info">
                <h3 className="sg__name">{game.name}</h3>
                {game.genres?.length > 0 && (
                  <span className="sg__genres">
                    {(Array.isArray(game.genres) ? game.genres : [])
                      .slice(0, 2)
                      .map((g) => (typeof g === "string" ? g : g.name))
                      .join(" · ")}
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
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
      released: PropTypes.string,
      platforms: PropTypes.arrayOf(PropTypes.string),
      genres: PropTypes.array,
    })
  ).isRequired,
};

export default SimilarGames;
