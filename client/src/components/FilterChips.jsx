import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  selectGenre,
  selectPlatform,
  alphOrder,
  ratingOrder,
  clear,
} from "../Redux/actions";
import "./Styles/FilterChips.css";

const chipVariants = {
  initial: { opacity: 0, scale: 0.85, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.15 } },
};

export default function FilterChips() {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.filterAndSortingState);
  const allVideogames = useSelector((state) => state.videogames || []);
  const loading = useSelector((state) => state.loading);

  // Build active chips
  const chips = useMemo(() => {
    const result = [];

    if (filterState.genre) {
      result.push({
        id: "genre",
        label: filterState.genre,
        icon: "category",
        onRemove: () => dispatch(selectGenre("-")),
      });
    }

    if (filterState.platform) {
      result.push({
        id: "platform",
        label: filterState.platform,
        icon: "sports_esports",
        onRemove: () => dispatch(selectPlatform("-")),
      });
    }

    if (filterState.sorting === "A-Z" || filterState.sorting === "Z-A") {
      result.push({
        id: "alpha",
        label: filterState.sorting,
        icon: "sort_by_alpha",
        onRemove: () => dispatch(alphOrder("-")),
      });
    }

    if (filterState.sorting === "5-1" || filterState.sorting === "1-5") {
      result.push({
        id: "rating",
        label: filterState.sorting === "5-1" ? "Highest first" : "Lowest first",
        icon: "hotel_class",
        onRemove: () => dispatch(ratingOrder("-")),
      });
    }

    return result;
  }, [filterState, dispatch]);

  // Compute accurate filtered count by re-filtering
  const hasFilters = chips.length > 0;
  const totalGames = allVideogames.length;

  const totalFiltered = useMemo(() => {
    if (!hasFilters) return totalGames;
    let filtered = allVideogames;
    if (filterState.genre) {
      filtered = filtered.filter((v) => v.genres.includes(filterState.genre));
    }
    if (filterState.platform) {
      filtered = filtered.filter((v) => v.platforms.includes(filterState.platform));
    }
    return filtered.length;
  }, [allVideogames, filterState, hasFilters, totalGames]);

  if (!hasFilters && !loading) return null;
  if (loading) return null;

  return (
    <div className="filter-chips-bar" role="status" aria-live="polite">
      <div className="filter-chips-inner">
        {/* Results counter */}
        <motion.span
          className="results-counter"
          key={totalFiltered}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {hasFilters ? (
            <>
              <strong>{totalFiltered}</strong> of {totalGames} games
            </>
          ) : (
            <>
              <strong>{totalGames}</strong> games
            </>
          )}
        </motion.span>

        {/* Chips */}
        <div className="filter-chips-list">
          <AnimatePresence mode="popLayout">
            {chips.map((chip) => (
              <motion.button
                key={chip.id}
                className="filter-chip"
                variants={chipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
                onClick={chip.onRemove}
                aria-label={`Remove filter: ${chip.label}`}
              >
                <span className="material-symbols-rounded chip-icon">
                  {chip.icon}
                </span>
                <span className="chip-label">{chip.label}</span>
                <span className="material-symbols-rounded chip-close">
                  close
                </span>
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Clear all */}
          <AnimatePresence>
            {chips.length > 1 && (
              <motion.button
                className="filter-chip filter-chip-clear"
                variants={chipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onClick={() => dispatch(clear())}
                aria-label="Clear all filters"
              >
                Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
