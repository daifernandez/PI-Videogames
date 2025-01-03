import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink , useNavigate} from "react-router-dom";
import { deleteVideogameDB, getvideogames } from "../Redux/actions";
import NavBar from "./NavBar";
import Loading from "./Loading";
import Cards from "./Cards";
import ScrollToTop from "./ScrollToTop.jsx";
import "./Styles/VideogameDetail.css";
import banner from "../img/banner.jpg";
import { createSelector } from 'reselect';
import { 
  FaPlaystation, 
  FaXbox, 
  FaWindows, 
  FaApple, 
  FaLinux, 
  FaAndroid,
 
} from 'react-icons/fa';
import { SiAtari, SiSega, SiNintendo } from 'react-icons/si';

const apiUrl = process.env.REACT_APP_API_HOST;

//selectores
const selectVideogames = state => state.videogames;
const selectDetailVideogame = (_, detailVideogame) => detailVideogame;

const selectSameGenreVideogames = createSelector(
  [selectVideogames, selectDetailVideogame],
  (videogames, detailVideogame) => {
    if (!detailVideogame) return [];
    
    return videogames
      .filter(
        videogame =>
          videogame.genres.includes(detailVideogame.genres[0]) &&
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

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [detailVideogame, setDetailVideogame] = useState();

  const sameGenreVideogames = useSelector((state) => 
    selectSameGenreVideogames(state, detailVideogame)
  );

  const hasVideogames = useSelector((state) => state.videogames.length > 0);

  useEffect(() => {
    setDetailVideogame();
    const fetchVideogameDetail = async () => {
      const videgameDetail = await getVideogameDetail(id);
      setDetailVideogame(videgameDetail);
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
    const platformLC = platform.toLowerCase();
    
    if (platformLC.includes('playstation')) return <FaPlaystation />;
    if (platformLC.includes('xbox')) return <FaXbox />;
    if (platformLC.includes('pc') || platformLC.includes('windows')) return <FaWindows />;
    if (platformLC.includes('mac') || platformLC.includes('apple')) return <FaApple />;
    if (platformLC.includes('linux')) return <FaLinux />;
    if (platformLC.includes('android')) return <FaAndroid />;
    if (platformLC.includes('nintendo switch')) return <SiNintendo />;
    if (platformLC.includes('nintendo') || platformLC.includes('wii') || platformLC.includes('game boy')) return <SiNintendo />;
    if (platformLC.includes('atari')) return <SiAtari />;
    if (platformLC.includes('sega')) return <SiSega />;
    return null;
  };

  if (detailVideogame) {
    return (
      <div>
        <ScrollToTop />
        <NavBar />
        <div className="detail-container">
          <img
            className="detail-main-image"
            src={detailVideogame.image ? detailVideogame.image : banner}
            alt="img not found"
          />

          <div className="detail-content">
            <div className="detail-text-info">
              <h1>{detailVideogame.name}</h1>
              <h5>{detailVideogame.genres.join(" - ")}</h5>
              <h4 className="star-rating">⭐️ {detailVideogame.rating}</h4>
              <h6>Released: {detailVideogame.released}</h6>
              <div
                dangerouslySetInnerHTML={{
                  __html: detailVideogame.description,
                }}
              />
              <div className="platforms-container">
                {detailVideogame.platforms.map((platform) => (
                  <NavLink
                    to={`/videogames/platform/${platform}`}
                    className="platform"
                    key={platform}
                  >
                    {getPlatformIcon(platform)}
                    <span className="platform-name">{platform}</span>
                  </NavLink>
                ))}
              </div>
              <button
                className="delete-button"
                onClick={handleDeleteVideogame}
                hidden={!detailVideogame.createdInDB}
              >
                <i className="material-symbols-rounded middle-align button-icon">
                  delete
                </i>
                <span className="middle-align">Delete Videogame</span>
              </button>
            </div>
            <div 
              className="similar-games-section"
              hidden={sameGenreVideogames.length === 0}
            >
              
              <h2 className="more-text">Games of the same genre</h2>
              <div className="similar-games-container">
                <Cards
                  key="videogames-cards"
                  videogames={sameGenreVideogames}
                  direction="horizontal"
                  className="similar-games-cards"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <NavBar />
        <Loading />
      </>
    );
  }
}
