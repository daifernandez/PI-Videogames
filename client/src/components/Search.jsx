import React from "react";
import "./Styles/Search.css";
import "./Styles/Button.css";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { getVideogameByName } from "../Redux/actions";
import { NavLink } from "react-router-dom";

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

  return (
    <div className="contenedor-component">
      <div>
        <input
          className="search-contenedor"
          type="search"
          placeholder="Videogame Name..."
          value={search}
          onChange={(e) => handleTextChange(e)}
        />
        <button className="custom-button" onClick={(e) => handleSubmit(e)}>
          Search
        </button>
      </div>
      <NavLink to="/createVideogame">
        <button className="custom-button"> + Create Videogame</button>
      </NavLink>
    </div>
  );
}
