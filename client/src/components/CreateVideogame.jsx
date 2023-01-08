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
  if (!input.name) {
    errors.name = "Name is required";
  }
  if (!input.description) {
    errors.description = "Description is required";
  }
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    errors.rating = "The rating needs to be between 1 and 5";
  }
  if (input.genres.length === 0) {
    errors.genres = "Genres is required";
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

  const [error, setError] = useState({
    name: "",
    description: "",
    rating: "",
    genres: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate(form);

    setError(newErrors);

    if (
      newErrors.name ||
      newErrors.description ||
      newErrors.rating ||
      newErrors.genres
    ) {
      alert("Please fill the required fileds.");
      return;
    }

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
      <h1 className="input-title">You can add your own Videogame</h1>

      <div className="contenedor-create2">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="input-label">Name:</label>
            <input
              className="barra"
              type="text"
              key="name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {error.name && <p className="input-forgot">{error.name}</p>}
          </div>
          <div>
            <label className="input-label">Released:</label>
            <input
              className="barra"
              type="date"
              key="released"
              name="released"
              value={form.released}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="input-label">Rating:</label>
            <input
              className="barra"
              type="number"
              step="0.1"
              min="1"
              max="5"
              key="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
            />
            {error.rating && <p className="input-forgot">{error.rating}</p>}
          </div>
          <div>
            <label className="input-label">Description:</label>
            <textarea
              className="description"
              type="text"
              key="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              cols="50"
            ></textarea>
            {error.description && (
              <p className="input-forgot">{error.description}</p>
            )}
          </div>
          <div>
            <fieldset>
              <legend className="input-label">Choose Genres</legend>
              <select
                className="barra"
                key="genreName"
                name="genreName"
                id=""
                required
                onChange={handleSelect}
              >
                <option selected disabled value="">
                  Genres
                </option>
                {genres.map((genre) => (
                  <option>{genre.name}</option>
                ))}
              </select>
              {error.genres && <p className="input-forgot">{error.genres}</p>}
              <div>
                <>
                  {form.genres.map((genre) => (
                    <button
                      className="genres"
                      key={genre}
                      type="button"
                      value={genre}
                      onClick={(e) => handleDeleteGenre(e)}
                    >
                      {genre} x
                    </button>
                  ))}
                </>
              </div>
            </fieldset>
          </div>

          <br />

          <fieldset>
            <legend className="input-label">Choose Platforms</legend>
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
            <label className="input-label">Image:</label>
            <input
              type="file"
              key="image"
              name="image"
              value={form.image}
              onChange={handleChange}
            />
          </div>
          <button
            className="form-button"
            key="submit"
            type="submit"
            value="submit"
            disabled={
              !form.name ||
              !form.description ||
              !(form.rating >= 1 && form.rating < 5) ||
              !form.genres
            }
          >
            Create Videogame
          </button>
        </form>
      </div>
    </div>
  );
}
