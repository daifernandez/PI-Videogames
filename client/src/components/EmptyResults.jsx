import React from "react";
import { useDispatch } from "react-redux";
import { clear } from "../Redux/actions";
import "./Styles/Button.css";
import "./Styles/EmptyResults.css";

export default function EmptyResults() {
  const dispatch = useDispatch();

  function handleClear(e) {
    e.preventDefault();
    dispatch(clear());
  }
  return (
    <div>
      <img
        className="empty-gif"
        src="https://media3.giphy.com/media/PgP2SoNRY3GRwuETmq/giphy.gif"
        alt="not found"
      />
      <p>No pudimos encontrar videojuegos para los filtros activos.</p>
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
