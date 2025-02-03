import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Search from "./Search";
import FiltersOrders from "./FiltersOrders";
import Cards from "./Cards";
import Paginado from "./Paginado";
import EmptyResults from "./EmptyResults";
import Loading from "./Loading";
import RecentGames from "./RecentGames";
import { getvideogames } from "../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import "./Styles/Home.css";
import "./Styles/Paginado.css";
import Footer from "./Footer";

export default function Home() {
  const dispatch = useDispatch();
  const videogames = useSelector((state) => state.videogamesOnScreen || []);
  const allVideogames = useSelector((state) => state.videogames || []);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    if (allVideogames.length === 0 && !loading && !error) {
      dispatch(getvideogames());
    }
  }, [dispatch, allVideogames.length, loading, error]);

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <EmptyResults message={error} isHome={true} />;
    }

    if (videogames.length === 0) {
      return <EmptyResults isHome={true} />;
    }

    return (
      <>
        <Cards
          key="videogames-cards"
          videogames={videogames}
          direction="vertical"
        />
        <Paginado />
      </>
    );
  };

  return (
    <div>
      <NavBar />
    
      <Search />
      <FiltersOrders />
      <div className="cont">
        {renderContent()}
      </div>
      <RecentGames />
      <Footer />
    </div>
  );
}
