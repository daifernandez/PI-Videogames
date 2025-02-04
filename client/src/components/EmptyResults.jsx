import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clear } from "../Redux/actions";
import "./Styles/Button.css";
import "./Styles/EmptyResults.css";

export default function EmptyResults({ isHome, message, suggestion }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleClear(e) {
    e.preventDefault();
    if (isHome) {
      dispatch(clear());
    } else {
      navigate(-1);
    }
  }
  
  return (
    <div className="empty-results-container">
      <img
        className="empty-gif"
        src="https://media3.giphy.com/media/PgP2SoNRY3GRwuETmq/giphy.gif"
        alt="not found"
      />
      <p className="empty-message">
        {message || "Sorry! We couldn't find any games"}
      </p>
      {suggestion && (
        <p className="empty-suggestion">{suggestion}</p>
      )}
      <button
        className="custom-button"
        onClick={(e) => {
          handleClear(e);
        }}
      >
        {isHome ? "Clear Filters" : "Go Back"}
      </button>
    </div>
  );
}
