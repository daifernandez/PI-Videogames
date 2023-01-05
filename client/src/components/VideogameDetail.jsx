import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteVideogameDB, getVideogameDetail } from "../Redux/actions";
import "./Styles/VideogameDetail.css";
import { useHistory } from "react-router-dom";

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector((state) => state.videogameDetail);
  const redirection = useHistory();

  useEffect(() => {
    dispatch(getVideogameDetail(id));
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

  if (detail) {
    return (
      <div>
        <div className="detail-container">
          <img
            className="detail-main-image"
            src={detail.image ? detail.image : "https://google.com"}
            alt="img not found"
          />

          <div className="detail-content">
            <div className="detail-text-info">
              <button
                onClick={handleDeleteVideogame}
                hidden={!detail.createdInDB}
              >
                Delete Videogame
              </button>
              {/* <button
                onClick={handlePutVideogame}
                hidden={!detail.createdInDB}
              >
                Put Videogame
              </button> */}
              <h1>{detail.name}</h1>
              <h5>{detail.genres.join(" - ")}</h5>
              <h4 className="star-rating">⭐️ {detail.rating}</h4>
              <h6>Released: {detail.released}</h6>
              <div dangerouslySetInnerHTML={{ __html: detail.description }} />
              <h4>{detail.platforms.join(", ")}</h4>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <h1>loading</h1>
      </>
    );
  }
}
