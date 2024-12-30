import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import Cards from "./Cards";
import { useSelector } from "react-redux";
import ScrollToTop from "./ScrollToTop.jsx";
import EmptyResults from "./EmptyResults";
import { createSelector } from 'reselect';

//selector
const selectVideogamesForPlatform = createSelector(
  [(state) => state.videogames, (_, platformName) => platformName],
  (videogames, platformName) => 
    videogames.filter((videogame) => videogame.platforms.includes(platformName))
);

export default function Platform() {
  const { name } = useParams();

  const videogamesForPlatform = useSelector((state) => 
    selectVideogamesForPlatform(state, name)
  );

  if (videogamesForPlatform.length > 0) {
    return (
      <div>
        <ScrollToTop />
        <NavBar />
        <h1>Videogames for {name}</h1>
        <Cards
          key="videogames"
          videogames={videogamesForPlatform}
          direction="vertical"
        />
      </div>
    );
  } else {
    return (
      <div>
        <NavBar />
        <EmptyResults isHome={false} />
      </div>
    );
  }
}
