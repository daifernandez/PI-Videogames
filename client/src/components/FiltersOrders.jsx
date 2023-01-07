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
import "./Styles/Filters.css";

export default function FiltersOrders() {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genres);
  const [selectRating, setSelectRating] = useState();
  const [selectAlphOrder, setSelectAlphOrder] = useState();
  const [genreSelect, setGenreSelect] = useState();
  const [selectFrom, setSelectFrom] = useState();

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  function handleSelectGenre(e) {
    e.preventDefault();
    dispatch(selectGenre(e.target.value));
  }
  function handleSelectFrom(e) {
    e.preventDefault();
    dispatch(getCreated(e.target.value));
  }

  function handleSelectOrderAlph(e) {
    e.preventDefault();
    dispatch(alphOrder(e.target.value));
  }

  function handleSelectRating(e) {
    e.preventDefault();
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
      <>
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
      </>
      <>
        <label>From:</label>
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
      </>
      <>
        <label>Alphabetical:</label>
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
      </>
      <>
        <label>Rating:</label>
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
      </>

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
