import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { postVideogame, getGenres } from "../Redux/actions";

export default function CreateVideogame() {
  const dispatch = useDispatch();
  const redirection = useHistory();
  const genres = useSelector((state) => state.genres);

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    rating: "",
    released: "",
    image: "",
    genres: [],
    platforms: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(postVideogame(form));
    alert("Videogame successfully created!!");
    setForm({
      name: "",
      description: "",
      rating: "",
      released: "",
      image: "",
      genres: [],
      platforms: [],
    });
    redirection.push("/home");
  };

  const handleChange = (e) => {
    const property = e.target.name;
    const value = e.target.value;
    setForm({
      ...form,
      [property]: value,
    });
  };

  const handleSelect = (e) => {
    setForm({
      ...form,
      genres: [...form.genres, e.target.value],
    });
  };

  const handleDeleteGenre = (e) => {
    const deleteGenre = form.genres.filter((genre) => genre !== e.target.value);
    setForm({
      ...form,
      genres: deleteGenre,
    });
  };

  return (
    <div>
      <NavLink exact to="/home">
        <button>Return</button>
      </NavLink>
      <h1>Formulario de creacion de videojuego</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            key="name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            key="description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Released:</label>
          <input
            type="date"
            key="released"
            name="released"
            value={form.released}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="range"
            key="rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Genres:</label>
          <select
            key="genreName"
            name="genreName"
            id=""
            onChange={handleSelect}
          >
            <option value="-" />
            {genres.map((genre) => (
              <option value={genre.name}>{genre.name}</option>
            ))}
          </select>
          <div>
            <>
              {form.genres.map((genre) => (
                <ul key={genre.name} value={genre.name}>
                  {genre}
                  <button
                    type="button"
                    value={genre}
                    onClick={(e) => handleDeleteGenre(e)}
                  >
                    x
                  </button>
                </ul>
              ))}
            </>
          </div>
        </div>

        <div>
          <label>Platforms:</label>
          <input type="checkbox" />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            key="image"
            name="image"
            value={form.image}
            onChange={handleChange}
          />
        </div>
        <button key="submit" type="submit" value="submit">
          Create Videogame
        </button>
      </form>
    </div>
  );
}
