import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postVideogame, getgenres, getvideogames } from "../Redux/actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { platformIcons } from '../utils/platformIcons';
import useToast from "../hooks/useToast";
import "./Styles/CreateVideogame.css";
import "./Styles/Button.css";
import "./Styles/PlatformStyles.css";
import Footer from "./Footer";

export function validate(input) {
  let errors = {};
  if (!input.name) {
    errors.name = "Name is required";
  } else if (input.name.length < 3) {
    errors.name = "Name must be at least 3 characters long";
  } else if (input.name.length > 50) {
    errors.name = "Name cannot be longer than 50 characters";
  }

  if (!input.description) {
    errors.description = "Description is required";
  } else if (input.description.length < 10) {
    errors.description = "Description must be at least 10 characters long";
  } else if (input.description.length > 2000) {
    errors.description = "Description cannot be longer than 2000 characters";
  }

  if (!input.rating) {
    errors.rating = "Rating is required";
  } else if (input.rating < 1 || input.rating > 5) {
    errors.rating = "Rating must be between 1 and 5";
  }

  if (input.platforms.length === 0) {
    errors.platforms = "You must select at least one platform";
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
  const [imagePreview, setImagePreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);

  const [touched, setTouched] = useState({
    name: false,
    description: false,
    rating: false,
    platforms: false
  });

  const [showTooltip, setShowTooltip] = useState("");

  const { addToast } = useToast();

  useEffect(() => {
    const calculateProgress = () => {
      let progress = 0;
      if (form.name) progress += 20;
      if (form.description) progress += 20;
      if (form.rating) progress += 20;
      if (form.platforms.length > 0) progress += 20;
      if (form.genres.length > 0) progress += 20;
      setFormProgress(progress);
    };
    calculateProgress();
  }, [form]);

  const handleImagePreview = (url, type) => {
    if (type === 'main') {
      setImagePreview(url);
    } else {
      const imageUrls = url.split(',').map(img => img.trim()).filter(img => img !== '');
      setImagesPreview(imageUrls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.type !== 'submit' && e.type !== 'click') return;
    
    setIsSubmitting(true);
    const newErrors = validate(form);
    setError(newErrors);
    if (
      newErrors.name ||
      newErrors.description ||
      newErrors.rating ||
      newErrors.platforms
    ) {
      addToast("Please complete all required fields.", { type: "warning" });
      setIsSubmitting(false);
      return;
    }
    try {
      dispatch(
        postVideogame(form, (createdVideogame) => {
          addToast("Game created successfully!", { type: "success" });
          const gameId = createdVideogame.id;
          setTimeout(() => navigate(`/videogame/${gameId}`), 1500);
        })
      );
    } catch (err) {
      addToast("Error creating game. Please try again.", { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const validationErrors = validate({
      ...form,
      [field]: form[field]
    });
    setError({ ...error, [field]: validationErrors[field] });
  };

  const handleFocus = (field, message) => {
    setShowTooltip(field);
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
      handleImagePreview(value, 'additional');
    } else if (property === 'image') {
      setForm({
        ...form,
        [property]: value,
      });
      handleImagePreview(value, 'main');
    } else {
      setForm({
        ...form,
        [property]: value,
      });
    }

    // Real-time validation
    const validationErrors = validate({
      ...form,
      [property]: value
    });
    setError({ ...error, [property]: validationErrors[property] });
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

  const handleDeleteMainImage = () => {
    setForm({
      ...form,
      image: ""
    });
    setImagePreview(null);
  };

  const handleDeleteAdditionalImage = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index);
    setForm({
      ...form,
      images: updatedImages
    });
    setImagesPreview(updatedImages);
  };

  return (
    <div>
      <NavBar />
      <div className="contenedor-create">
        <div className="contenedor-create2">
          <h1 className="input-title">Create New Game</h1>
          <div className="header-content">
            <p className="input-subtitle">
              Bienvenido al creador de juegos. En este formulario podrás dar vida a tu propio videojuego añadiendo toda la información necesaria, desde los detalles básicos hasta el contenido multimedia y características especiales.
            </p>
            <div className="required-info">
              <span className="required-mark">*</span>
              <p className="input-subtitle-note">Los campos marcados son obligatorios para completar la creación.</p>
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{width: `${formProgress}%`}}
            ></div>
            <span className="progress-text">{formProgress}% Completed</span>
          </div>

          <div className="form-steps">
            <button 
              type="button"
              className={`step-button ${formStep === 1 ? 'active' : ''}`}
              onClick={() => setFormStep(1)}
            >
              Basic Information
            </button>
            <button 
              type="button"
              className={`step-button ${formStep === 2 ? 'active' : ''}`}
              onClick={() => setFormStep(2)}
            >
              Media
            </button>
            <button 
              type="button"
              className={`step-button ${formStep === 3 ? 'active' : ''}`}
              onClick={() => setFormStep(3)}
            >
              Additional Details
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            {formStep === 1 && (
              <>
                <div className="form-group">
                  <label className="input-label">
                    Name*
                    <span className="input-help" onMouseEnter={() => handleFocus('name')}>
                      ?
                    </span>
                  </label>
                  <div className="input-container">
                    <input
                      className={`barra ${touched.name && error.name ? 'error' : ''}`}
                      type="text"
                      name="name"
                      placeholder="Enter game name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                      onFocus={() => handleFocus('name')}
                    />
                    {form.name && !error.name && <span className="input-check">✓</span>}
                  </div>
                  {touched.name && error.name && <p className="input-forgot">{error.name}</p>}
                  {showTooltip === 'name' && (
                    <div className="tooltip">
                      Name must be unique and descriptive, between 3 and 50 characters.
                    </div>
                  )}
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
                  <div className="rating-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-button ${Number(form.rating) >= star ? 'active' : ''}`}
                        onClick={() => handleChange({ target: { name: 'rating', value: star } })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {error.rating && <p className="input-forgot">{error.rating}</p>}
                </div>

                <div className="form-group">
                  <label className="input-label">
                    Description*
                    <span className="input-help" onMouseEnter={() => handleFocus('description')}>
                      ?
                    </span>
                  </label>
                  <textarea
                    className={`barra-description ${touched.description && error.description ? 'error' : ''}`}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onBlur={() => handleBlur('description')}
                    placeholder="Describe the game..."
                  ></textarea>
                  <div className="description-footer">
                    <div className="character-count">
                      {form.description.length}/2000
                    </div>
                    {form.description && !error.description && (
                      <div className="description-status">
                        <span className="input-check">✓</span> Valid description
                      </div>
                    )}
                  </div>
                  {touched.description && error.description && (
                    <p className="input-forgot">{error.description}</p>
                  )}
                </div>
              </>
            )}

            {formStep === 2 && (
              <>
                <div className="form-group full-width">
                  <label className="input-label">Main Image</label>
                  <div className="image-upload-container">
                    <input
                      className="barra"
                      type="url"
                      name="image"
                      placeholder="Enter main image URL"
                      value={form.image}
                      onChange={handleChange}
                    />
                    {imagePreview && (
                      <div className="image-preview-container">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="image-preview"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'default-image-path';
                          }}
                        />
                        <button 
                          type="button"
                          className="delete-image-button"
                          onClick={handleDeleteMainImage}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="input-label">Additional Images</label>
                  <div className="image-upload-container">
                    <input
                      className="barra"
                      type="text"
                      name="images"
                      placeholder="Enter additional image URLs (separated by commas)"
                      value={form.images.join(', ')}
                      onChange={handleChange}
                    />
                    <div className="additional-images-preview">
                      {imagesPreview.map((url, index) => (
                        <div key={index} className="additional-image-container">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="additional-image-preview"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'default-image-path';
                            }}
                          />
                          <button 
                            type="button"
                            className="delete-image-button"
                            onClick={() => handleDeleteAdditionalImage(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="input-label">Video</label>
                  <input
                    className="barra"
                    type="url"
                    name="video"
                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                    value={form.video}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {formStep === 3 && (
              <>
                <div className="form-group full-width">
                  <label className="input-label">Genres</label>
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
                </div>

                <div className="form-group full-width">
                  <label className="input-label">Platforms*</label>
                  <div className="platforms-grid">
                    {platforms.map((platform) => (
                      <label key={platform} className="platform-checkbox">
                        <input
                          type="checkbox"
                          name={platform}
                          value={platform}
                          onChange={handleSelectPlatform}
                          checked={form.platforms.includes(platform)}
                        />
                        <FontAwesomeIcon 
                          icon={platformIcons[platform] || platformIcons['Default']} 
                          className="platform-icon"
                        />
                        <span className="platform-name">{platform}</span>
                      </label>
                    ))}
                  </div>
                  {error.platforms && <p className="input-forgot">{error.platforms}</p>}
                </div>

                <div className="form-group full-width">
                  <label className="input-label">Website</label>
                  <input
                    className="barra"
                    type="url"
                    name="website"
                    placeholder="Enter game website URL"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="input-label">ESRB Rating</label>
                  <select
                    className="barra"
                    name="esrb_rating"
                    value={form.esrb_rating}
                    onChange={handleChange}
                  >
                    <option value="">Select ESRB Rating</option>
                    <option value="Everyone">Everyone</option>
                    <option value="Everyone 10+">Everyone 10+</option>
                    <option value="Teen">Teen</option>
                    <option value="Mature">Mature</option>
                    <option value="Adults Only">Adults Only</option>
                    <option value="Rating Pending">Rating Pending</option>
                  </select>
                </div>

                <div className="form-group full-width">
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

                <div className="form-group full-width">
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
              </>
            )}

            <div className="form-navigation">
              {formStep > 1 && (
                <button
                  type="button"
                  className="nav-button"
                  onClick={() => setFormStep(formStep - 1)}
                >
                  <span className="button-icon">←</span> Previous
                </button>
              )}
              
              {formStep < 3 ? (
                <button
                  type="button"
                  className="nav-button"
                  onClick={() => {
                    const currentFields = formStep === 1 
                      ? ['name', 'description', 'rating']
                      : ['image'];
                    
                    const hasErrors = currentFields.some(field => error[field]);
                    if (!hasErrors) {
                      setFormStep(formStep + 1);
                    } else {
                      currentFields.forEach(field => handleBlur(field));
                    }
                  }}
                >
                  Next <span className="button-icon">→</span>
                </button>
              ) : (
                <button
                  className="form-button"
                  type="submit"
                  onClick={(e) => {
                    // Asegurar que solo se procese el click directo en el botón
                    if (e.target === e.currentTarget) {
                      handleSubmit(e);
                    }
                  }}
                  disabled={
                    isSubmitting ||
                    !form.name ||
                    !form.description ||
                    !form.rating ||
                    form.platforms.length === 0 ||
                    error.name ||
                    error.description ||
                    error.rating ||
                    error.platforms
                  }
                >
                  {isSubmitting ? (
                    <div className="button-content">
                      <span className="spinner"></span>
                      Creating...
                    </div>
                  ) : (
                    'Create Game'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
