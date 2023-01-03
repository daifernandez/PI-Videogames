import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { postVideogame, getGenres } from "../Redux/actions";
import "./Styles/CreateVideogame.css";
import "./Styles/Button.css";

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
    <div className="contenedor-create">
      <h1>You cant add your own Videogame!!</h1>

      <div className="contenedor-create">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="input-title">Name:</label>
            <input
              className="input-create"
              type="text"
              key="name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {error.name && <p className="input-validation">{error.name}</p>}
          </div>
          <div>
            <label className="input-title">Description:</label>
            <input
              className="input-create"
              type="text"
              key="description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            {error.description && (
              <p className="input-validation">{error.description}</p>
            )}
          </div>
          <div>
            <label className="input-title">Released:</label>
            <input
              className="input-create"
              type="date"
              key="released"
              name="released"
              value={form.released}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="input-title">Rating:</label>
            <input
              className="input-create"
              type="number"
              step="0.1"
              min="0"
              max="5"
              key="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
            />
            {error.rating && <p className="input-validation">{error.rating}</p>}
          </div>
          <div>
            <fieldset>
              <legend className="input-title">Choose Genres:</legend>
              <select
                className="input-create"
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
                    <button>
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
                    </button>
                  ))}
                </>
              </div>
            </fieldset>
          </div>

          <br />

          <fieldset>
            <legend className="input-title">Choose Platforms:</legend>
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
            <label className="input-title">Image:</label>
            <input
              type="file"
              key="image"
              name="image"
              value={form.image}
              onChange={handleChange}
            />
          </div>
          <button
            className="custom-button"
            key="submit"
            type="submit"
            value="submit"
            disabled={!form.name || !form.description}
          >
            Create Videogame
          </button>
        </form>
      </div>
    </div>
  );
}
