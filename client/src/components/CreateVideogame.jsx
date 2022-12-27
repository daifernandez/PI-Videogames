import React from "react";
import { NavLink } from "react-router-dom";

export default function CreateVideogame() {
  return (
    <div>
      <NavLink exact to="/home">
        <button> Return</button>
      </NavLink>
      <h1>Formulario de creacion de videojuego</h1>
      <form>
        <div>
          <label>Name:</label>
          <input type="text" />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" />
        </div>
        <div>
          <label>Released:</label>
          <input type="date" />
        </div>
        <div>
          <label>Rating:</label>
          <input type="range" />
        </div>
        <div>
          <label>Genres:</label>
          <input type="checkbox" />
        </div>
        <div>
          <label>Platforms:</label>
          <input type="checkbox" />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" />
        </div>
        <button key="submit" type="submit" value="submit">
          Create Videogame
        </button>
      </form>
    </div>
  );
}
