import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from 'reselect';
import NavBar from "./NavBar";
import Cards from "./Cards";
import ScrollToTop from "./ScrollToTop.jsx";
import EmptyResults from "./EmptyResults";
import Loading from "./Loading";
import "./Styles/Platform.css";

// Selector memoizado
const selectVideogamesForPlatform = createSelector(
  [(state) => state.videogames, (_, platformName) => platformName],
  (videogames, platformName) => 
    videogames.filter((videogame) => videogame.platforms.includes(platformName))
);

export default function Platform() {
  const { name } = useParams();
  const isLoading = useSelector((state) => state.loading);
  const videogamesForPlatform = useSelector((state) => 
    selectVideogamesForPlatform(state, name)
  );

  if (isLoading) {
    return (
      <div className="platform-container">
        <NavBar />
        <Loading />
      </div>
    );
  }

  return (
    <div className="platform-container">
      <ScrollToTop />
      <NavBar />
      {videogamesForPlatform.length > 0 ? (
        <>
          <h1 className="platform-title">
            Juegos disponibles para {name}
          </h1>
          <Cards
            key="videogames"
            videogames={videogamesForPlatform}
            direction="vertical"
          />
        </>
      ) : (
        <EmptyResults isHome={false} />
      )}
    </div>
  );
}
