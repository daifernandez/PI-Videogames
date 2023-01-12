import React from "react";
import "./Styles/Search.css";
import "./Styles/Button.css";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { getVideogameByName } from "../Redux/actions";

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
          className="search-bar"
          type="search"
          placeholder="Videogame Name..."
          value={search}
          onChange={(e) => handleTextChange(e)}
        />
        <button className="custom-button" onClick={(e) => handleSubmit(e)}>
          Search
        </button>
      </div>
      {/* <NavLink to="/createVideogame">
        <button className="custom-buttonIcon">
          <div className="icon-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="icon-button"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
           Add Videogame
          </div>
        </button>
      </NavLink> */}
    </div>
  );
}
