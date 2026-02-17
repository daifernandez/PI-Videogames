import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { getVideogameByName, clear, getvideogames } from "../Redux/actions";
import useSearchHistory from "../hooks/useSearchHistory";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import SearchSuggestions from "./SearchSuggestions";
import "./Styles/Search.css";

const DEBOUNCE_MS = 300;
const MAX_SUGGESTIONS = 5;

export default function Search() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allVideogames = useSelector((state) => state.videogames || []);
  const recentGames = useSelector((state) => state.recentGames || []);
  const upcomingGames = useSelector((state) => state.upcomingGames || []);
  const searchQuery = useSelector((state) => state.searchQuery);

  const [search, setSearch] = useState(searchQuery || "");
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);
  const lastSubmitTime = useRef(0);

  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();
  const isOnline = useOnlineStatus();

  // Sincronizar input con searchQuery de Redux (ej. al cargar desde URL)
  useEffect(() => {
    if (searchQuery) setSearch(searchQuery);
    else setSearch("");
  }, [searchQuery]);

  // Debounce the search query
  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(search.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  // Sugerencias desde catálogo, recientes y próximos (para que "Reanimal" etc. aparezcan)
  const suggestions = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    const query = debouncedQuery.toLowerCase();
    const results = [];
    const seenIds = new Set();

    const addIfMatches = (game) => {
      if (!seenIds.has(game.id) && game.name?.toLowerCase().includes(query)) {
        seenIds.add(game.id);
        results.push(game);
        return results.length < MAX_SUGGESTIONS;
      }
      return true;
    };

    for (const game of allVideogames) {
      if (!addIfMatches(game)) break;
    }
    for (const game of recentGames) {
      if (!addIfMatches(game)) break;
    }
    for (const game of upcomingGames) {
      if (!addIfMatches(game)) break;
    }

    return results;
  }, [debouncedQuery, allVideogames, recentGames, upcomingGames]);

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
      if (!term || !isOnline) return;
      if (Date.now() - lastSubmitTime.current < 800) return; // F.6 evitar doble submit
      lastSubmitTime.current = Date.now();
      addSearch(term);
      dispatch(getVideogameByName(term));
      setSearch("");
      setShowDropdown(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    },
    [search, dispatch, addSearch, isOnline]
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
      if (!isOnline) return;
      addSearch(term);
      dispatch(getVideogameByName(term));
      setSearch("");
      setShowDropdown(false);
      setActiveIndex(-1);
    },
    [dispatch, addSearch, isOnline]
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
              role="combobox"
              placeholder="Search games..."
              value={search}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              aria-label="Search games"
              aria-controls="search-suggestions-listbox"
              aria-expanded={shouldShowDropdown}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck="false"
            />
            {(search || searchQuery) && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearch("");
                  setActiveIndex(-1);
                  dispatch(clear());
                  if (allVideogames.length === 0) dispatch(getvideogames());
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
            disabled={!search.trim() || !isOnline}
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
