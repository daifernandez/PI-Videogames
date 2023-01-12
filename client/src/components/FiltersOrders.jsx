import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGenres,
  selectGenre,
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
  const [selectRating, setSelectRating] = useState("-");
  const [selectAlphOrder, setSelectAlphOrder] = useState("-");
  const [genreSelect, setGenreSelect] = useState("-");
  const [selectFrom, setSelectFrom] = useState();

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  function handleSelectGenre(e) {
    e.preventDefault();
    setGenreSelect(e.target.value);
    dispatch(selectGenre(e.target.value));
  }
  function handleSelectFrom(e) {
    e.preventDefault();
    dispatch(getCreated(e.target.value));
  }

  function handleSelectOrderAlph(e) {
    e.preventDefault();
    setSelectRating("-");
    setSelectAlphOrder(e.target.value);
    dispatch(alphOrder(e.target.value));
  }

  function handleSelectRating(e) {
    e.preventDefault();
    setSelectAlphOrder("-");
    setSelectRating(e.target.value);
    dispatch(ratingOrder(e.target.value));
  }

  function handleClearFiltersOrder(e) {
    e.preventDefault();
    dispatch(clear());
    setSelectRating("-");
    setSelectAlphOrder("-");
    setGenreSelect("-");
    setSelectFrom("all");
  }
  return (
    <div className="contenedor-filters">
      <div className="filter">
        <label>Genre:</label>
        <select
          className="dropdown"
          id="genreOrder"
          value={genreSelect}
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
        <span class="material-symbols-rounded filter-icon">folder_open</span>
        <select
          className="dropdown"
          name="dropdown"
          id="comesFrom"
          value={selectFrom}
          onChange={(e) => handleSelectFrom(e)}
        >
          <option value="all"> All Videogames</option>
          <option value="createdInDB"> Videogames Created </option>
          <option value="ApiCreated"> Existing Videogames</option>
        </select>
      </div>
      <div className="filter">
        <span class="material-symbols-outlined filter-icon">sort_by_alpha</span>
        <select
          className="dropdown"
          id="alphabOrder"
          value={selectAlphOrder}
          onChange={(e) => handleSelectOrderAlph(e)}
        >
          <option value="-">-</option>
          <option value="ASC">A-Z</option>
          <option value="DESC">Z-A</option>
        </select>
      </div>
      <div className="filter">
        <span class="material-symbols-rounded filter-icon">hotel_class</span>
        <select
          className="dropdown"
          id="healthScoreOrder"
          value={selectRating}
          onChange={(e) => handleSelectRating(e)}
        >
          <option value="-">-</option>
          <option value="Higher">Higher</option>
          <option value="Lower">Lower</option>
        </select>
      </div>

      <button
        className="secondary-button"
        onClick={(e) => {
          handleClearFiltersOrder(e);
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}
