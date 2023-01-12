import NavBar from "./NavBar";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteVideogameDB, getVideogameDetail } from "../Redux/actions";
import "./Styles/VideogameDetail.css";
import Cards from "./Cards";
import { useHistory } from "react-router-dom";
import Loading from "./Loading";
import banner from "../img/banner.jpg";

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const redirection = useHistory();
  const [detailVideogame, setDetailVideogame] = useState();

  useEffect(() => {
    const fetchVideogameDetail = async () => {
      const videgameDetail = await getVideogameDetail(id);
      setDetailVideogame(videgameDetail);
    };

    fetchVideogameDetail();
  }, [dispatch, id]);

  const handleDeleteVideogame = (e) => {
    e.preventDefault();
    dispatch(deleteVideogameDB(id));
    alert("Videogame successfully deleted!!");
    redirection.push("/home");
  };

  // const handlePutVideogame = (e) => {
  //   e.preventDefault();
  //   dispatch(putVideogameDB(id));
  // };

  if (detailVideogame) {
    return (
      <div>
        <NavBar />
        <div className="detail-container">
          <img
            className="detail-main-image"
            src={detailVideogame.image ? detailVideogame.image : banner}
            alt="img not found"
          />

          <div className="detail-content">
            <div className="detail-text-info">
              <button
                className="custom-button"
                onClick={handleDeleteVideogame}
                hidden={!detailVideogame.createdInDB}
              >
                Delete Videogame
              </button>
              {/* <button
                onClick={handlePutVideogame}
                hidden={!detail.createdInDB}
              >
                Put Videogame
              </button> */}
              <h1>{detailVideogame.name}</h1>
              <h5>{detailVideogame.genres.join(" - ")}</h5>
              <h4 className="star-rating">⭐️ {detailVideogame.rating}</h4>
              <h6>Released: {detailVideogame.released}</h6>
              <div
                dangerouslySetInnerHTML={{
                  __html: detailVideogame.description,
                }}
              />
              <h4>{detailVideogame.platforms.join(", ")}</h4>
              <h1>More Actions games</h1>
              <Cards
                key="videogames-cards"
                videogames={[
                  detailVideogame,
                  detailVideogame,
                  detailVideogame,
                  detailVideogame,
                ]}
              />
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
