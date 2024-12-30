import React, { useState } from "react";
import "./Styles/Search.css";
import { useDispatch } from "react-redux";
import { getVideogameByName } from "../Redux/actions";

export default function Search() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  function handleTextChange(e) {
    e.preventDefault();
    setSearch(e.target.value);
  }
  
  function handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }
    if (search.trim()) {
      dispatch(getVideogameByName(search.trim()));
      setSearch("");
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (!search.trim()) {
        alert("Por favor ingresa un nombre de videojuego para buscar");
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <div className="contenedor-component">
      <form className="search-container" onSubmit={handleSubmit}>
        <input
          className="search-bar"
          type="search"
          placeholder="Search games..."
          value={search}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          aria-label="Search games"
        />
        <button
          className="search-button"
          type="submit"
          disabled={!search.trim()}
        >
          Search
        </button>
      </form>
    </div>
  );
}
