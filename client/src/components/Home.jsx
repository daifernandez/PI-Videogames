import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Search from "./Search";
import FiltersOrders from "./FiltersOrders";
import FilterChips from "./FilterChips";
import Cards from "./Cards";
import Paginado from "./Paginado";
import EmptyResults from "./EmptyResults";
import RecentGames from "./RecentGames";
import UpcomingGames from "./UpcomingGames";
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
  const searchError = useSelector((state) => state.searchError);

  useEffect(() => {
    if (allVideogames.length === 0 && !loading && !error) {
      dispatch(getvideogames());
    }
  }, [dispatch, allVideogames.length, loading, error]);

  const renderGameContent = () => {
    if (loading) {
      return (
        <Cards
          videogames={[]}
          direction="vertical"
          loading={true}
        />
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <EmptyResults 
            message={error} 
            isHome={true}
            suggestion="Try refreshing the page or come back later"
          />
        </div>
      );
    }

    if (videogames.length === 0) {
      return (
        <EmptyResults 
          isHome={true}
          message={searchError || "No games found matching your search"}
          suggestion={searchError ? "Prueba con otro nombre o limpia los filtros" : "Try different filters or search terms"}
        />
      );
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
    <div className="home-container">
      <NavBar />
      <main>
        <Search />
        <FiltersOrders />
        <FilterChips />
        <div className="games-section">
          {renderGameContent()}
        </div>
        <div className="featured-sections">
          <RecentGames />  
          <UpcomingGames />
        </div>
      </main>
      <Footer />
    </div>
  );
}
