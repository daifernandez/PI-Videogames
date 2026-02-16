import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import banner from "../img/banner.jpg";
import "./Styles/SearchSuggestions.css";

function HighlightMatch({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="suggestion-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchSuggestions({
  suggestions,
  recentSearches,
  query,
  activeIndex,
  isLoading,
  onSelectSuggestion,
  onSelectRecent,
  onRemoveRecent,
  onClearHistory,
  onSubmitSearch,
}) {
  const hasQuery = query.trim().length > 0;
  const showRecent = !hasQuery && recentSearches.length > 0;
  const showSuggestions = hasQuery;
  const showEmpty = hasQuery && !isLoading && suggestions.length === 0;

  if (!showRecent && !showSuggestions) return null;

  return (
    <motion.div
      className="suggestions-dropdown"
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {showRecent && (
        <div className="suggestions-section">
          <div className="suggestions-header">
            <span className="suggestions-header-label">
              <span className="material-symbols-rounded suggestions-header-icon">history</span>
              Recent searches
            </span>
            <button
              className="suggestions-clear-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClearHistory();
              }}
              type="button"
            >
              Clear all
            </button>
          </div>
          <ul className="suggestions-list" role="listbox" id="search-suggestions-listbox">
            {recentSearches.map((term, i) => (
              <li
                key={term}
                className={`suggestion-item suggestion-recent ${activeIndex === i ? "suggestion-active" : ""}`}
                role="option"
                aria-selected={activeIndex === i}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelectRecent(term);
                }}
              >
                <span className="material-symbols-rounded suggestion-icon">history</span>
                <span className="suggestion-text">{term}</span>
                <button
                  className="suggestion-remove-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemoveRecent(term);
                  }}
                  type="button"
                  aria-label={`Remove ${term}`}
                >
                  <span className="material-symbols-rounded">close</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuggestions && !showEmpty && (
        <div className="suggestions-section">
          {isLoading ? (
            <div className="suggestions-loading">
              <div className="suggestion-skeleton" />
              <div className="suggestion-skeleton" />
              <div className="suggestion-skeleton" />
            </div>
          ) : (
            <ul className="suggestions-list" role="listbox" id="search-suggestions-listbox">
              <AnimatePresence>
                {suggestions.map((game, i) => (
                  <motion.li
                    key={game.id}
                    className={`suggestion-item suggestion-game ${activeIndex === i ? "suggestion-active" : ""}`}
                    role="option"
                    aria-selected={activeIndex === i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.15 }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectSuggestion(game);
                    }}
                  >
                    <NavLink
                      to={`/videogame/${game.id}`}
                      className="suggestion-game-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectSuggestion(game);
                      }}
                    >
                      <div className="suggestion-thumb-wrapper">
                        <img
                          className="suggestion-thumb"
                          src={game.image || banner}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                      <div className="suggestion-info">
                        <span className="suggestion-name">
                          <HighlightMatch text={game.name} query={query} />
                        </span>
                        <span className="suggestion-meta">
                          {game.rating && (
                            <span className="suggestion-rating">
                              <span className="material-symbols-rounded suggestion-star">star</span>
                              {parseFloat(game.rating).toFixed(1)}
                            </span>
                          )}
                          {game.genres?.length > 0 && (
                            <span className="suggestion-genres">
                              {game.genres.slice(0, 2).join(" · ")}
                            </span>
                          )}
                        </span>
                      </div>
                    </NavLink>
                  </motion.li>
                ))}
              </AnimatePresence>
              {suggestions.length > 0 && (
                <li
                  className="suggestion-item suggestion-search-all"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSubmitSearch();
                  }}
                >
                  <span className="material-symbols-rounded suggestion-icon">search</span>
                  <span className="suggestion-text">
                    Search "<strong>{query}</strong>"
                  </span>
                  <span className="suggestion-shortcut">Enter</span>
                </li>
              )}
            </ul>
          )}
        </div>
      )}

      {showEmpty && (
        <div className="suggestions-empty">
          <span className="material-symbols-rounded suggestions-empty-icon">search_off</span>
          <p className="suggestions-empty-title">No games found</p>
          <p className="suggestions-empty-hint">
            Try a different spelling or search for another game
          </p>
          <button
            className="suggestions-empty-action"
            onMouseDown={(e) => {
              e.preventDefault();
              onSubmitSearch();
            }}
            type="button"
          >
            Search anyway
          </button>
        </div>
      )}
    </motion.div>
  );
}
