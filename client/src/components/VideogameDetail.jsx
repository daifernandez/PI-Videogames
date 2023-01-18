import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, NavLink } from "react-router-dom";
import {
  deleteVideogameDB,
  getVideogameDetail,
  getvideogames,
} from "../Redux/actions";
import NavBar from "./NavBar";
import Loading from "./Loading";
import banner from "../img/banner.jpg";
import "./Styles/VideogameDetail.css";
import Cards from "./Cards";
import ScrollToTop from "./ScrollToTop.jsx";

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const redirection = useHistory();
  const [detailVideogame, setDetailVideogame] = useState();

  const sameGenreVideogames = useSelector((state) => {
    if (detailVideogame) {
      return state.videogames
        .filter(
          (videogame) =>
            videogame.genres.includes(detailVideogame.genres[0]) &&
            videogame.id !== detailVideogame.id
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    } else {
      return [];
    }
  });
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
    redirection.push("/home");
  };

  // const handlePutVideogame = (e) => {
  //   dispatch(putVideogameDB(id));
  // };

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
              <h4>
                {detailVideogame.platforms.map((platform) => (
                  <NavLink
                    to={`/videogames/platform/${platform}`}
                    className="platform"
                    key={platform}
                  >
                    {platform}
                  </NavLink>
                ))}
              </h4>
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
            <h2 className="more-text">More similar genre games</h2>
            <Cards
              key="videogames-cards"
              videogames={sameGenreVideogames}
              direction="horizontal"
            />
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
