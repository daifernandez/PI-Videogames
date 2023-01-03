import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVideogameDetail } from "../Redux/actions";
import { NavLink } from "react-router-dom";
import "./Styles/VideogameDetail.css";

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector((state) => state.videogameDetail);

  useEffect(() => {
    dispatch(getVideogameDetail(id));
  }, [dispatch, id]);

  if (detail) {
    return (
      <div>
        {/* <NavLink exact to="/home">
          <button>Return to Home</button>
        </NavLink> */}
        <img
          className="detail-main-image"
          src={detail.image ? detail.image : "https://google.com"}
          alt="img not found"
        />

        <h1>{detail.name}</h1>
        <h4>{detail.rating}</h4>
        <h6>Released: {detail.released}</h6>

        <div dangerouslySetInnerHTML={{ __html: detail.description }} />
        <h5>{detail.genres.join(" - ")}</h5>
        <h4>{detail.platforms.join(", ")}</h4>
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
