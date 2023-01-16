import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { clear } from "../Redux/actions";
import "./Styles/Button.css";
import "./Styles/EmptyResults.css";

export default function EmptyResults({ isHome }) {
  const dispatch = useDispatch();
  const history = useHistory();

  function handleClear(e) {
    e.preventDefault();
    if (isHome) {
      dispatch(clear());
    } else {
      history.goBack();
    }
  }
  return (
    <div>
      <img
        className="empty-gif"
        src="https://media3.giphy.com/media/PgP2SoNRY3GRwuETmq/giphy.gif"
        alt="not found"
      />
      <p>sorry! we couldn't find videogames</p>
      <button
        className="secondary-button"
        onClick={(e) => {
          handleClear(e);
        }}
      >
        Return
      </button>
    </div>
  );
}
