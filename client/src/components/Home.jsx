import React from "react";
import NavBar from "./NavBar";
import Search from "./Search";
import FiltersOrders from "./FiltersOrders";
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
    if (!fetchedVideogames) {
      dispatch(getvideogames());
    }
  }, [dispatch, fetchedVideogames]);

  if (fetchedVideogames) {
    if (videogames.length) {
      return (
        <div>
          <NavBar />
          <Search />
          <FiltersOrders />
          <Cards key="videogames-cards" videogames={videogames} />
          <Paginado />
        </div>
      );
    } else {
      return (
        <div>
          <NavBar />
          <Search />
          <FiltersOrders />
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
