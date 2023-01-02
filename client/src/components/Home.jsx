import React from "react";
import NavBar from "./NavBar";
import Search from "./Search";
import Filter from "./Filters";
import Cards from "./Cards";
import Paginado from "./Paginado";
import EmptyResults from "./EmptyResults";
import Loading from "./Loading";
import { getvideogames } from "../Redux/actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const videogames = useSelector((state) => state.videogamesOnScreen);
  const fetchedVideogames = useSelector((state) => state.videogames.length > 0);

  useEffect(() => {
    dispatch(getvideogames());
  }, [dispatch]);

  if (fetchedVideogames) {
    if (videogames.length) {
      return (
        <div>
          <NavBar />
          <Search />
          <Filter />
          <Cards key="videogames-cards" videogames={videogames} />
          <Paginado />
        </div>
      );
    } else {
      return (
        <div>
          <NavBar />
          <Search />
          <Filter />
          <EmptyResults />
        </div>
      );
    }
  } else {
    return (
      <div>
        <NavBar />
        <Loading />
      </div>
    );
  }
}
