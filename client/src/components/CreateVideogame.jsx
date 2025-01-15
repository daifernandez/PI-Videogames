import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postVideogame, getgenres, getvideogames } from "../Redux/actions";
import "./Styles/CreateVideogame.css";
import "./Styles/Button.css";
import Footer from "./Footer";


export function validate(input) {
  let errors = {};
  if (!input.name) {
    errors.name = "Name is required";
  }
  if (!input.description) {
    errors.description = "Description is required";
  }
  if (input.description.length > 2000) {
    errors.description =
      "Sorry, description must not contain more than 2000 characters";
  }
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    errors.rating = "The rating needs to be between 1 and 5";
  }
  if (input.platforms.length === 0) {
    errors.platforms = "Genres is required";
  }
  return errors;
}

export default function CreateVideogame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const genres = useSelector((state) => state.genres);
  const platforms = useSelector((state) => state.platforms);

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(getgenres());
    }
  }, [dispatch, genres]);

  useEffect(() => {
    if (platforms.length === 0) {
      dispatch(getvideogames());
    }
  }, [dispatch, platforms]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    rating: "",
    released: "",
    image: "",
    images: [],
    video: "",
    genres: [],
    platforms: [],
    website: "",
    esrb_rating: "",
    developers: [],
    publishers: []
  });

  const [error, setError] = useState({
    name: "",
    description: "",
    rating: "",
    platforms: "",
  });

  const [genresSelected, setGenresSelected] = useState("Genres");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(form);
    setError(newErrors);
    if (
      newErrors.name ||
      newErrors.description ||
      newErrors.rating ||
      newErrors.platforms
    ) {
      alert("Please fill the required fileds.");
      return;
    }
    dispatch(
      postVideogame(form, (createdVideogame) => {
        alert(`Videogame: ${createdVideogame.name} created!`);
       navigate(`/videogame/${createdVideogame.id}`);
      })
    );
  };

  const handleChange = (e) => {
    const property = e.target.name;
    const value = e.target.value;

    if (property === 'developers' || property === 'publishers') {
      setForm({
        ...form,
        [property]: value.split(',').map(item => item.trim()).filter(item => item !== '')
      });
    } else if (property === 'images') {
      setForm({
        ...form,
        images: value.split(',').map(url => url.trim()).filter(url => url !== '')
      });
    } else {
      setForm({
        ...form,
        [property]: value,
      });
    }

    if (property === "name") {
      const regularExpression = /[`@#$%^&*()_+\-=[\]{};'"\\|<>/~]/;
      if (regularExpression.test(value)) {
        error.name = "The name cannot containg special characters";
        setError(error);
      } else {
        error.name = "";
        setError(error);
      }
      if (value.length > 50) {
        error.name = "the name cannot contain more than 200 characters";
      }
    }
    if (property === "rating") {
      if (value < 1 || value > 5) {
        error.rating = "The rating needs to be between 1 and 5";
        setError(error);
      } else {
        error.rating = "";
        setError(error);
      }
    }
  };

  const handleSelectGenre = (e) => {
    setForm({
      ...form,
      genres: [...form.genres, e.target.value],
    });
    setGenresSelected(e.target.value);
  };

  const handleDeleteGenre = (e) => {
    const deleteGenre = form.genres.filter((genre) => genre !== e.target.value);
    setForm({
      ...form,
      genres: deleteGenre,
    });
    if (e.target.value === genresSelected) setGenresSelected("Genres");
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
      <NavBar />
      <div className="contenedor-create">
        <div className="contenedor-create2">
          <h1 className="input-title">Create New Game</h1>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="input-label">Name*</label>
              <input
                className="barra"
                type="text"
                name="name"
                placeholder="Enter game name"
                value={form.name}
                onChange={handleChange}
              />
              {error.name && <p className="input-forgot">{error.name}</p>}
            </div>

            <div className="form-group">
              <label className="input-label">Release Date</label>
              <input
                className="barra"
                type="date"
                name="released"
                value={form.released}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Rating*</label>
              <input
                className="barra"
                type="number"
                step="0.1"
                min="1"
                max="5"
                name="rating"
                placeholder="Rate from 1 to 5"
                value={form.rating}
                onChange={handleChange}
              />
              {error.rating && <p className="input-forgot">{error.rating}</p>}
            </div>

            <div className="form-group full-width">
              <label className="input-label">Description*</label>
              <textarea
                className="barra-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter game description"
              ></textarea>
              {error.description && <p className="input-forgot">{error.description}</p>}
            </div>

            <fieldset className="form-group">
              <legend>Genres</legend>
              <select
                className="barra"
                name="genreName"
                value={genresSelected}
                onChange={handleSelectGenre}
              >
                <option disabled value="Genres">Select Genres</option>
                {genres.map((genre) => (
                  <option
                    key={genre.id}
                    disabled={form.genres.includes(genre.name)}
                  >
                    {genre.name}
                  </option>
                ))}
              </select>
              <div className="genres-container">
                {form.genres.map((genre) => (
                  <button
                    className="button-genres"
                    key={genre}
                    type="button"
                    value={genre}
                    onClick={handleDeleteGenre}
                  >
                    {genre} ×
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend>Platforms*</legend>
              <div className="platforms-grid">
                {platforms.map((platform) => (
                  <label key={platform} className="platform-checkbox">
                    <input
                      type="checkbox"
                      name={platform}
                      value={platform}
                      onChange={handleSelectPlatform}
                    />
                    {platform}
                  </label>
                ))}
              </div>
              {error.platforms && <p className="input-forgot">{error.platforms}</p>}
            </fieldset>

            <div className="form-group">
              <label className="input-label">Website</label>
              <input
                className="barra"
                type="url"
                name="website"
                placeholder="Enter game website"
                value={form.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="input-label">ESRB Rating</label>
              <select
                className="barra"
                name="esrb_rating"
                value={form.esrb_rating}
                onChange={handleChange}
              >
                <option value="">Select ESRB Rating</option>
                <option value="E">E (Everyone)</option>
                <option value="E10+">E10+ (Everyone 10+)</option>
                <option value="T">T (Teen)</option>
                <option value="M">M (Mature)</option>
                <option value="AO">AO (Adults Only)</option>
                <option value="RP">RP (Rating Pending)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Developers</label>
              <input
                className="barra"
                type="text"
                name="developers"
                placeholder="Enter developers (separated by commas)"
                value={form.developers.join(', ')}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Publishers</label>
              <input
                className="barra"
                type="text"
                name="publishers"
                placeholder="Enter publishers (separated by commas)"
                value={form.publishers.join(', ')}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Imagen Principal</label>
              <input
                className="barra"
                type="url"
                name="image"
                placeholder="Ingresa la URL de la imagen principal"
                value={form.image}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Imágenes Adicionales</label>
              <input
                className="barra"
                type="text"
                name="images"
                placeholder="Ingresa URLs de imágenes adicionales (separadas por comas)"
                value={form.images.join(', ')}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="input-label">Video</label>
              <input
                className="barra"
                type="url"
                name="video"
                placeholder="Ingresa la URL del video (YouTube, Vimeo, etc.)"
                value={form.video}
                onChange={handleChange}
              />
            </div>

            <div className="full-width">
              <p className="required-text">(*) Required fields</p>
              <button
               className="form-button"
                type="submit"
                disabled={
                  !form.name ||
                  error.name ||
                  !form.description ||
                  error.description ||
                  !form.rating ||
                  error.rating ||
                  !form.platforms ||
                  error.platforms
                }
              >
                Create Game
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
