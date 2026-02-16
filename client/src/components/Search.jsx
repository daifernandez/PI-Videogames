import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { getVideogameByName } from "../Redux/actions";
import useSearchHistory from "../hooks/useSearchHistory";
import SearchSuggestions from "./SearchSuggestions";
import "./Styles/Search.css";

const DEBOUNCE_MS = 300;
const MAX_SUGGESTIONS = 5;

export default function Search() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allVideogames = useSelector((state) => state.videogames || []);

  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);

  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();

  // Debounce the search query
  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(search.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  // Filter suggestions from local store
  const suggestions = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    const query = debouncedQuery.toLowerCase();
    const results = [];

    for (const game of allVideogames) {
      if (game.name.toLowerCase().includes(query)) {
        results.push(game);
        if (results.length >= MAX_SUGGESTIONS) break;
      }
    }

    return results;
  }, [debouncedQuery, allVideogames]);

  // Total items for keyboard navigation
  const totalItems = useMemo(() => {
    if (search.trim()) {
      return suggestions.length + (suggestions.length > 0 ? 1 : 0); // +1 for "search all"
    }
    return history.length;
  }, [search, suggestions, history]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      if (e) e.preventDefault();
      const term = search.trim();
      if (!term) return;
      addSearch(term);
      dispatch(getVideogameByName(term));
      setSearch("");
      setShowDropdown(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    },
    [search, dispatch, addSearch]
  );

  const handleSelectSuggestion = useCallback(
    (game) => {
      addSearch(game.name);
      setSearch("");
      setShowDropdown(false);
      setActiveIndex(-1);
      navigate(`/videogame/${game.id}`);
    },
    [navigate, addSearch]
  );

  const handleSelectRecent = useCallback(
    (term) => {
      addSearch(term);
      dispatch(getVideogameByName(term));
      setSearch("");
      setShowDropdown(false);
      setActiveIndex(-1);
    },
    [dispatch, addSearch]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!showDropdown) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          setShowDropdown(true);
          return;
        }
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % totalItems);
          break;

        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
          break;

        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && showDropdown) {
            if (search.trim()) {
              // In suggestions mode
              if (activeIndex < suggestions.length) {
                handleSelectSuggestion(suggestions[activeIndex]);
              } else {
                // "Search all" option
                handleSubmit();
              }
            } else {
              // In recent searches mode
              if (activeIndex < history.length) {
                handleSelectRecent(history[activeIndex]);
              }
            }
          } else {
            if (search.trim()) {
              handleSubmit();
            }
          }
          break;

        case "Escape":
          setShowDropdown(false);
          setActiveIndex(-1);
          inputRef.current?.blur();
          break;

        default:
          break;
      }
    },
    [
      showDropdown,
      activeIndex,
      totalItems,
      search,
      suggestions,
      history,
      handleSelectSuggestion,
      handleSubmit,
      handleSelectRecent,
    ]
  );

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setActiveIndex(-1);
    if (!showDropdown) setShowDropdown(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay to allow click events on suggestions
    setTimeout(() => {
      setShowDropdown(false);
      setActiveIndex(-1);
    }, 150);
  };

  const shouldShowDropdown =
    showDropdown &&
    (search.trim().length >= 2 || (!search.trim() && history.length > 0));

  return (
    <div className="contenedor-component">
      <div
        className={`search-wrapper ${isFocused ? "search-wrapper--focused" : ""}`}
        ref={containerRef}
      >
        <form className="search-container" onSubmit={handleSubmit}>
          <div className={`search-input-group ${isFocused ? "search-input-group--focused" : ""}`}>
            <span className={`material-symbols-rounded search-icon ${isFocused ? "search-icon--focused" : ""}`}>
              search
            </span>
            <input
              ref={inputRef}
              className="search-bar"
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              aria-label="Search games"
              aria-expanded={shouldShowDropdown}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck="false"
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearch("");
                  setActiveIndex(-1);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            )}
          </div>
          <button
            className="search-button"
            type="submit"
            disabled={!search.trim()}
            aria-label="Submit search"
          >
            <span className="material-symbols-rounded search-button-icon">arrow_forward</span>
          </button>
        </form>

        <AnimatePresence>
          {shouldShowDropdown && (
            <SearchSuggestions
              suggestions={suggestions}
              recentSearches={history}
              query={search.trim()}
              activeIndex={activeIndex}
              isLoading={false}
              onSelectSuggestion={handleSelectSuggestion}
              onSelectRecent={handleSelectRecent}
              onRemoveRecent={removeSearch}
              onClearHistory={clearHistory}
              onSubmitSearch={handleSubmit}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
