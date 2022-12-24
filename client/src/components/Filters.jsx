import React from "react";

export default function Filter() {
  return (
    <>
      <h3>Filtros y Ordenamiento</h3>
      <>
        <label>Genre:</label>
        <select className="dropdown" id="genreOrder">
          <option value="-">-</option>
        </select>
      </>
      <>
        <label>From:</label>
        <select name="dropdown" id="comesFrom">
          <option value="all"> All Videogames</option>
          <option value="createdInDB"> Created by me</option>
          <option value="ApiCreated"> from Api</option>
        </select>
      </>

      <>
        <label>Alphabetical:</label>
        <select className="dropdown" id="alphabOrder">
          <option value="-">-</option>
          <option value="ASC">A-Z</option>
          <option value="DESC">Z-A</option>
        </select>
      </>
      <>
        <label>Rating:</label>
        <select className="dropdown" id="healthScoreOrder">
          <option value="Higher">Higher</option>
          <option value="Lower">Lower</option>
        </select>
      </>
      <div>
        <button className="button-reload">Clear Filters</button>
      </div>
    </>
  );
}
