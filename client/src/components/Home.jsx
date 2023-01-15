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
import "./Styles/Home.css";

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
          <div className="cont">
            <div>
              <FiltersOrders />
              <div>
                <Cards key="videogames-cards" videogames={videogames} direction="vertical" />
                <Paginado />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <NavBar />
          <Search />
          <div className="cont">
            <FiltersOrders />
            <EmptyResults />
          </div>
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
