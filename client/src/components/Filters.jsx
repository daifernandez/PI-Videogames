import React from "react";
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

export default function Filter() {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genres);

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

  function handleClearFilters(e) {
    e.preventDefault();
    dispatch(clear());
  }
  return (
    <>
      <h3>Filtros y Ordenamiento</h3>
      <>
        <label>Genre:</label>
        <select
          className="dropdown"
          id="genreOrder"
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
          name="dropdown"
          id="comesFrom"
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
          onChange={(e) => handleSelectRating(e)}
        >
          <option value="Higher">Higher</option>
          <option value="Lower">Lower</option>
        </select>
      </>
      <div>
        <button
          className="button-reload"
          onClick={(e) => {
            handleClearFilters(e);
          }}
        >
          Clear Filters
        </button>
      </div>
    </>
  );
}
