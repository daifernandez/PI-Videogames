import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { postVideogame, getGenres } from "../Redux/actions";
// import { convertErrorToString } from "@11ty/eleventy/src/EleventyErrorUtil";

const platforms = [
  "Game Boy Advance",
  "Nintendo Switch",
  "Nintendo 64",
  "PS4",
  "PS5",
  "PC",
  "Wii",
];

//VALIDACION
export function validate(input) {
  let errors = {};

  //Name
  if (!input.name) {
    errors.name = "Name is required";
  }
  //Description
  if (!input.description) {
    errors.description = "Description is required";
  } else if (!/(?=.*[0-9])/.test(input.description)) {
    errors.description = "Description is invalid";
  }
  //rating
  if (input.rating > 5) {
    errors.rating = "The rating cannot be higher than 5";
  }
  if (!input.platforms) {
    errors.description = "Platforms is required";
  }

  return errors;
}

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

  //estado de los errores
  const [error, setError] = useState({});

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
    setError(
      validate({
        ...form,
        [property]: value,
      })
    );
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

  const handleSelectPlatform = (e) => {
    if (e.target.checked) {
      setForm({
        ...form,
        platforms: [...form.platforms, e.target.value],
      });
    } else {
      const deletePlatform = form.platforms.filter(
        (platform) => platform !== e.target.value
      );
      setForm({
        ...form,
        platforms: deletePlatform,
      });
    }
  };

  return (
    <div>
      <NavLink exact to="/home">
        <button>Return to Home</button>
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
          {error.name && <p>{error.name}</p>}
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
          {error.description && <p>{error.description}</p>}
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
            type="number"
            step="0.1"
            min="0"
            max="5"
            key="rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
          />
          {error.rating && <p>{error.rating}</p>}
        </div>
        <div>
          <fieldset>
            <legend>Choose Genres:</legend>
            <select
              key="genreName"
              name="genreName"
              id=""
              onChange={handleSelect}
            >
              {genres.map((genre) => (
                <option>{genre.name}</option>
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
          </fieldset>
        </div>

        <br />

        <fieldset>
          <legend>Choose Platforms:</legend>
          <br />
          {platforms.map((platform) => (
            <label>
              <input
                type="checkbox"
                name={platform}
                value={platform}
                onChange={handleSelectPlatform}
              />
              {platform}
              <br />
              {error.platform && <p>{error.platform}</p>}
            </label>
          ))}
        </fieldset>

        <br />
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
        <button
          key="submit"
          type="submit"
          value="submit"
          disabled={!form.name || !form.description}
        >
          Create Videogame
        </button>
      </form>
    </div>
  );
}
