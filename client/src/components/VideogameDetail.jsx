import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVideogameDetail } from "../Redux/actions";
import { NavLink } from "react-router-dom";

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
        <NavLink exact to="/home">
          <button>Return to Home</button>
        </NavLink>
        <img
          src={detail.image ? detail.image : "https://google.com"}
          alt="img not found"
        />

        <h1>{detail.name}</h1>
        <h5>{detail.released}</h5>
        <h4>{detail.rating}</h4>
        {/* <p>{detail.description}</p> */}
        <div dangerouslySetInnerHTML={{ __html: detail.description }} />
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
