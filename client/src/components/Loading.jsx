import React from "react";
import "./Styles/Loading.css";

export default function Loading() {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <h1>Loading</h1>
        <img
          className="img-loading"
          src="https://media3.giphy.com/media/nXNFe7gfINxpMBl845/giphy.gif"
          alt="not found"
        />
      </div>
    </div>
  );
}
