import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  getgenres,
  selectGenre,
  selectPlatform,
  alphOrder,
  ratingOrder,
  clear,
  getCreated,
} from "../Redux/actions";
import "./Styles/FiltersOrders.css";

export default function FiltersOrders() {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genres);
  const platforms = useSelector((state) => state.platforms);
  const genre = useSelector(
    (state) => state.filterAndSortingState.genre ?? "-"
  );
  const platform = useSelector(
    (state) => state.filterAndSortingState.platform ?? "-"
  );
  const origin = useSelector(
    (state) => state.filterAndSortingState.origin ?? "all"
  );
  const rating = useSelector((state) => {
    if (
      state.filterAndSortingState.sorting === "1-5" ||
      state.filterAndSortingState.sorting === "5-1"
    ) {
      return state.filterAndSortingState.sorting;
    }
    return "-";
  });
  const alph = useSelector((state) => {
    if (
      state.filterAndSortingState.sorting === "A-Z" ||
      state.filterAndSortingState.sorting === "Z-A"
    ) {
      return state.filterAndSortingState.sorting;
    }
    return "-";
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const sheetRef = useRef(null);

  const activeFilterCount = [
    genre !== "-" ? 1 : 0,
    platform !== "-" ? 1 : 0,
    origin !== "all" ? 1 : 0,
    alph !== "-" ? 1 : 0,
    rating !== "-" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  useEffect(() => {
    dispatch(getgenres());
  }, [dispatch]);

  // Close mobile sheet on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClick = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSelectGenre = useCallback((e) => {
    dispatch(selectGenre(e.target.value));
  }, [dispatch]);

  const handleSelectPlatform = useCallback((e) => {
    dispatch(selectPlatform(e.target.value));
  }, [dispatch]);

  const handleSelectFrom = useCallback((e) => {
    dispatch(getCreated(e.target.value));
  }, [dispatch]);

  const handleSelectOrderAlph = useCallback((e) => {
    dispatch(alphOrder(e.target.value));
  }, [dispatch]);

  const handleSelectRating = useCallback((e) => {
    dispatch(ratingOrder(e.target.value));
  }, [dispatch]);

  const handleClearFiltersOrder = useCallback(() => {
    dispatch(clear());
  }, [dispatch]);

  const filterControls = (
    <>
      {/* ── Filter group ── */}
      <div className="filter-group">
        <span className="filter-group-label">Filter</span>
        <div className="filter-group-controls">
          <div className="filter-item">
            <label htmlFor="filter-genre">Genre</label>
            <select
              className="filter-select"
              id="filter-genre"
              value={genre}
              onChange={handleSelectGenre}
            >
              <option value="-">All</option>
              {genres.map((g) => (
                <option key={g.name} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="filter-platform">Platform</label>
            <select
              className="filter-select"
              id="filter-platform"
              value={platform}
              onChange={handleSelectPlatform}
            >
              <option value="-">All</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="filter-origin">Source</label>
            <select
              className="filter-select"
              id="filter-origin"
              value={origin}
              onChange={handleSelectFrom}
            >
              <option value="all">All</option>
              <option value="DB">Created</option>
              <option value="API">Existing</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Sort group ── */}
      <div className="filter-group">
        <span className="filter-group-label">Sort</span>
        <div className="filter-group-controls">
          <div className="filter-item">
            <label htmlFor="filter-alpha">Name</label>
            <select
              className="filter-select"
              id="filter-alpha"
              value={alph}
              onChange={handleSelectOrderAlph}
            >
              <option value="-">Default</option>
              <option value="A-Z">A — Z</option>
              <option value="Z-A">Z — A</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="filter-rating">Rating</label>
            <select
              className="filter-select"
              id="filter-rating"
              value={rating}
              onChange={handleSelectRating}
            >
              <option value="-">Default</option>
              <option value="5-1">Highest first</option>
              <option value="1-5">Lowest first</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ══════════ Desktop filters ══════════ */}
      <div className="filters-bar" role="search" aria-label="Game filters">
        <div className="filters-bar-inner">
          {filterControls}

          {activeFilterCount > 0 && (
            <motion.button
              className="clear-filters-btn"
              onClick={handleClearFiltersOrder}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Clear all filters"
            >
              <span className="material-symbols-rounded">filter_list_off</span>
              Clear
            </motion.button>
          )}
        </div>
      </div>

      {/* ══════════ Mobile floating button ══════════ */}
      <button
        className="mobile-filter-fab"
        onClick={() => setMobileOpen(true)}
        aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
      >
        <span className="material-symbols-rounded">tune</span>
        Filters
        {activeFilterCount > 0 && (
          <span className="filter-badge">{activeFilterCount}</span>
        )}
      </button>

      {/* ══════════ Mobile bottom sheet ══════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="sheet"
              ref={sheetRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              role="dialog"
              aria-label="Filters"
            >
              <div className="sheet-handle" />
              <div className="sheet-header">
                <h3>Filters & Sort</h3>
                <button
                  className="sheet-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close filters"
                >
                  <span className="material-symbols-rounded">close</span>
                </button>
              </div>

              <div className="sheet-body">
                {filterControls}
              </div>

              <div className="sheet-footer">
                {activeFilterCount > 0 && (
                  <button
                    className="sheet-clear-btn"
                    onClick={() => {
                      handleClearFiltersOrder();
                    }}
                  >
                    Clear all
                  </button>
                )}
                <button
                  className="sheet-apply-btn"
                  onClick={() => setMobileOpen(false)}
                >
                  Show results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
