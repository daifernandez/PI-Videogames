import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate} from "react-router-dom";
import { deleteVideogameDB, getvideogames } from "../Redux/actions";
import NavBar from "./NavBar";
import Loading from "./Loading";
import ScrollToTop from "./ScrollToTop.jsx";
import MediaGallery from "./MediaGallery";
import "./Styles/VideogameDetail.css";
import banner from "../img/banner.jpg";
import { createSelector } from 'reselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { platformIcons } from '../utils/platformIcons';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';
import SimilarGames from './SimilarGames';

const apiUrl = process.env.REACT_APP_API_HOST;

//selectores
const selectVideogames = state => state.videogames;
const selectDetailVideogame = (_, detailVideogame) => detailVideogame;

const selectSameGenreVideogames = createSelector(
  [selectVideogames, selectDetailVideogame],
  (videogames, detailVideogame) => {
    if (!detailVideogame || !videogames) return [];
    
    return videogames
      .filter(
        videogame =>
          videogame.genres?.some(genre => 
            detailVideogame.genres?.includes(typeof genre === 'string' ? genre : genre.name)
          ) &&
          videogame.id !== detailVideogame.id
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }
);

async function getVideogameDetail(id) {
  const response = await axios.get(`${apiUrl}/videogame/${id}`);
  return response.data;
}

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<BsStarFill key={i} className="star filled" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<BsStarHalf key={i} className="star half" />);
    } else {
      stars.push(<BsStar key={i} className="star empty" />);
    }
  }

  return (
    <div className="star-rating-container">
      <div className="stars" title={`${rating} de 5 estrellas`}>
        {stars}
      </div>
      <span className="rating-number">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [detailVideogame, setDetailVideogame] = useState();
  const [activeTab, setActiveTab] = useState('screenshots');
  const [isLoading, setIsLoading] = useState(true);

  const sameGenreVideogames = useSelector((state) => 
    selectSameGenreVideogames(state, detailVideogame)
  );

  const hasVideogames = useSelector((state) => state.videogames.length > 0);

  useEffect(() => {
    setDetailVideogame();
    setIsLoading(true);
    const fetchVideogameDetail = async () => {
      try {
        const videgameDetail = await getVideogameDetail(id);
        setDetailVideogame(videgameDetail);
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideogameDetail();
  }, [dispatch, id]);

  useEffect(() => {
    if (!hasVideogames) {
      dispatch(getvideogames());
    }
  }, [dispatch, hasVideogames]);

  const handleDeleteVideogame = (e) => {
    dispatch(deleteVideogameDB(id));
    alert("Videogame successfully deleted!!");
    navigate("/home");
  };


  const getPlatformIcon = (platform) => {
    const icon = platformIcons[platform] || platformIcons['Default'];
    return <FontAwesomeIcon icon={icon} />;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePlatformClick = (platform) => {
    navigate(`/platform/${encodeURIComponent(platform)}`);
  };

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="loading-container">
          <Loading />
        </div>
      </>
    );
  }

  if (detailVideogame) {
    return (
      <div className="detail-page">
        <ScrollToTop />
        <NavBar />
        
        <div className="detail-container">
          <div className="detail-header">
            <img
              className="detail-main-image"
              src={detailVideogame.image || banner}
              alt={detailVideogame.name}
            />
          </div>

          <div className="detail-content">
            <div className="detail-text-info">
              <header className="game-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <h1>{detailVideogame.name}</h1>
                  {detailVideogame.createdInDB && (
                    <div className="actions-section">
                      <button
                        className="delete-icon-button"
                        onClick={(e) => {
                          if (window.confirm('¿Estás seguro que deseas eliminar este juego?')) {
                            handleDeleteVideogame(e);
                          }
                        }}
                        aria-label="Eliminar juego"
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  )}
                </div>
                <StarRating rating={detailVideogame.rating} />
              </header>

              <section className="game-info-section">
                <div className="description-container">
                  <h2>Description</h2>
                  <div 
                    className="description-text"
                    dangerouslySetInnerHTML={{ 
                      __html: detailVideogame.description.replace(/\n/g, '<br />') 
                    }}
                  />
                </div>

                <div className="metadata-grid">
                  {detailVideogame.website && (
                    <div className="metadata-item">
                      <a 
                        href={detailVideogame.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        <span>Website</span>
                        <FontAwesomeIcon icon={platformIcons['Web']} />
                      </a>
                    </div>
                  )}

                  {detailVideogame.esrb_rating && (
                    <div className="metadata-item">
                      <div className="esrb-rating">
                        <FontAwesomeIcon icon={platformIcons['Default']} />
                        <span>ESRB Rating: {detailVideogame.esrb_rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                {(detailVideogame.developers?.length > 0 || detailVideogame.publishers?.length > 0) && (
                  <div className="credits-section">
                    {detailVideogame.developers?.length > 0 && (
                      <div className="developers">
                        <h3>Developers</h3>
                        <p>{detailVideogame.developers.join(', ')}</p>
                      </div>
                    )}
                    
                    {detailVideogame.publishers?.length > 0 && (
                      <div className="publishers">
                        <h3>Publishers</h3>
                        <p>{detailVideogame.publishers.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="platforms-container">
                  {detailVideogame.platforms.map((platform, index) => (
                    <span 
                      key={index} 
                      className="platform"
                      onClick={() => handlePlatformClick(platform)}
                      style={{ cursor: 'pointer' }}
                    >
                      {getPlatformIcon(platform)}
                      <span className="platform-name">{platform}</span>
                    </span>
                  ))}
                </div>
              </section>

              <section className="media-section">
                <div className="media-tabs">
                  <button 
                    className={`tab-button ${activeTab === 'screenshots' ? 'active' : ''}`}
                    onClick={() => setActiveTab('screenshots')}
                  >
                    Screenshots
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'trailers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('trailers')}
                  >
                    Trailers
                  </button>
                </div>

                <div className="media-content">
                  <MediaGallery 
                    gameId={id} 
                    type={activeTab}
                  />
                </div>
              </section>

              <SimilarGames games={sameGenreVideogames} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="error-container">
        <h2>Could not load game</h2>
        <button onClick={handleGoBack} className="back-button">
          Back to Home
        </button>
      </div>
    </>
  );
}
