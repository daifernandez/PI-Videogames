import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Search from "./Search";
import FiltersOrders from "./FiltersOrders";
import Cards from "./Cards";
import Paginado from "./Paginado";
import EmptyResults from "./EmptyResults";
import Loading from "./Loading";
import { getvideogames } from "../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import "./Styles/Home.css";
import Footer from "./Footer";

export default function Home() {
  const dispatch = useDispatch();
  const videogames = useSelector((state) => state.videogamesOnScreen);
  const needsToFetchVideogames = useSelector(
    (state) => state.videogames.length === 0
  );

  useEffect(() => {
    if (needsToFetchVideogames) {
      dispatch(getvideogames());
    }
  }, [dispatch, needsToFetchVideogames]);

  if (needsToFetchVideogames) {
    return (
      <div>
        <NavBar />
        <Loading />
        <Footer />
      </div>
    );
  } else {
    let content;
    if (videogames.length) {
      content = (
        <div>
          <Cards
            key="videogames-cards"
            videogames={videogames}
            direction="vertical"
          />
          <Paginado />
        </div>
      );
    } else {
      content = <EmptyResults isHome={true} />;
    }

    return (
      <div>
        <NavBar />
        <Search />
        <FiltersOrders />
        <div className="cont">{content}</div>
        <Footer />
      </div>
    );
  }
}
