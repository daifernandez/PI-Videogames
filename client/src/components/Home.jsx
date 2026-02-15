import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Search from "./Search";
import FiltersOrders from "./FiltersOrders";
import Cards from "./Cards";
import Paginado from "./Paginado";
import EmptyResults from "./EmptyResults";
import Loading from "./Loading";
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

  const renderLoadingSkeleton = () => {
    return (
      <div className="loading-skeleton">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-rating"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGameContent = () => {
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

    if (videogames.length === 0 && !loading) {
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
        <div className="games-section">
          {renderGameContent()}
          {loading && (
            <div className="loader-container">
              <div className="loader-content">
                <Loading />
                <p>Loading the best games for you...</p>
              </div>
              {renderLoadingSkeleton()}
            </div>
          )}
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
