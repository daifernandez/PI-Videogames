import React, { useState } from "react";
import "./Styles/Search.css";
import "./Styles/Button.css";
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
    dispatch(getVideogameByName(search));
    setSearch("");
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (search === "") {
        alert("Please add a videogame name to search");
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <div className="contenedor-component">
      <div>
        <input
          className="search-bar"
          type="search"
          placeholder="Search 100s of videogames..."
          value={search}
          onChange={(e) => handleTextChange(e)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="custom-button"
          onClick={(e) => handleSubmit(e)}
          disabled={search === ""}
        >
          Search
        </button>
      </div>
    </div>
  );
}
