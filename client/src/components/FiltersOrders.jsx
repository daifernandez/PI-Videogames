import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGenres,
  selectGenre,
  selectPlatform,
  alphOrder,  
  ratingOrder,
  clear,
  getCreated,
} from "../Redux/actions";
import "./Styles/Button.css";
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
    } else {
      return "-";
    }
  });
  const alph = useSelector((state) => {
    if (
      state.filterAndSortingState.sorting === "A-Z" ||
      state.filterAndSortingState.sorting === "Z-A"
    ) {
      return state.filterAndSortingState.sorting;
    } else {
      return "-";
    }
  });

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  function handleSelectGenre(e) {
    dispatch(selectGenre(e.target.value));
  }
  function handleSelectPlatform(e) {
    dispatch(selectPlatform(e.target.value));
  }
  function handleSelectFrom(e) {
    dispatch(getCreated(e.target.value));
  }

  function handleSelectOrderAlph(e) {
    dispatch(alphOrder(e.target.value));
  }

  function handleSelectRating(e) {
    dispatch(ratingOrder(e.target.value));
  }

  function handleClearFiltersOrder(e) {
    dispatch(clear());
  }

  return (
    <div className="contenedor-filters">
      <div className="filter">
        <label>Genre:</label>
        <select
          className="dropdown"
          id="genre"
          value={genre}
          onChange={(e) => handleSelectGenre(e)}
        >
          <option value="-">-</option>
          {genres.map((genre) => (
            <option key={genre.name} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div className="filter">
        <label> Platform:</label>
        <select
          className="dropdown"
          id="platform"
          value={platform}
          onChange={(e) => handleSelectPlatform(e)}
        >
          <option value="-">-</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <span className="material-symbols-rounded filter-icon">
          folder_open
        </span>
        <select
          className="dropdown"
          name="dropdown"
          id="comesFrom"
          value={origin}
          onChange={(e) => handleSelectFrom(e)}
        >
          <option value="all"> All Videogames</option>
          <option value="DB"> Videogames Created </option>
          <option value="API"> Existing Videogames</option>
        </select>
      </div>
      <div className="filter">
        <span className="material-symbols-outlined filter-icon">
          sort_by_alpha
        </span>
        <select
          className="dropdown"
          id="alphabOrder"
          value={alph}
          onChange={(e) => handleSelectOrderAlph(e)}
        >
          <option value="-">-</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
        </select>
      </div>
      <div className="filter">
        <span className="material-symbols-rounded filter-icon">
          hotel_class
        </span>
        <select
          className="dropdown"
          id="healthScoreOrder"
          value={rating}
          onChange={(e) => handleSelectRating(e)}
        >
          <option value="-">-</option>
          <option value="5-1">Higher</option>
          <option value="1-5">Lower</option>
        </select>
      </div>

      <button
        className="button-clear"
        onClick={(e) => {
          handleClearFiltersOrder(e);
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}
