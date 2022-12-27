import React from "react";
import "./Styles/Search.css";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { getVideogameByName, clear } from "../Redux/actions";

export default function Search() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  function handleTextChange(e) {
    e.preventDefault();
    setSearch(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    dispatch(getVideogameByName(search));
    setSearch("");
  }
  function handleClearSearch(e) {
    e.preventDefault();
    dispatch(clear(e.target.value));
  }

  return (
    <div>
      <input
        className="search-contenedor"
        type="text"
        placeholder="Videogame Name..."
        value={search}
        onChange={(e) => handleTextChange(e)}
      />
      <button className="search-button" onClick={(e) => handleSubmit(e)}>
        Search
      </button>
      <button className="search-button" onClick={(e) => handleClearSearch(e)}>
        Clear Search
      </button>
    </div>
  );
}
