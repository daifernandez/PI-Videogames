import React, { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import NavBar from "./NavBar";
import Search from "./Search";
import FiltersOrders from "./FiltersOrders";
import FilterChips from "./FilterChips";
import Cards from "./Cards";
import Paginado from "./Paginado";
import EmptyResults from "./EmptyResults";
import RecentGames from "./RecentGames";
import UpcomingGames from "./UpcomingGames";
import SectionErrorBoundary from "./SectionErrorBoundary.jsx";
import { getvideogames } from "../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useUrlState } from "../hooks/useUrlState";
import "./Styles/Home.css";
import "./Styles/Paginado.css";
import Footer from "./Footer";

export default function Home() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  useUrlState();

  // Restaurar scroll al volver del detalle (A.4)
  useEffect(() => {
    const stored = sessionStorage.getItem("homeScrollY");
    if (stored) {
      sessionStorage.removeItem("homeScrollY");
      const scrollY = parseInt(stored, 10);
      if (!Number.isNaN(scrollY) && scrollY > 0) {
        requestAnimationFrame(() => window.scrollTo(0, scrollY));
      }
    }
  }, [location.key]);
  const videogames = useSelector((state) => state.videogamesOnScreen || []);
  const allVideogames = useSelector((state) => state.videogames || []);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);
  const searchError = useSelector((state) => state.searchError);

  useEffect(() => {
    // No cargar lista completa si hay búsqueda en URL (evita sobrescribir resultados)
    if (searchParams.get("search")) return;
    if (allVideogames.length === 0 && !loading && !error) {
      dispatch(getvideogames());
    }
  }, [dispatch, allVideogames.length, loading, error, searchParams]);

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
            isError={true}
            suggestion="Try refreshing the page or come back later"
            onRetry={() => dispatch(getvideogames())}
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
      <main role="main" aria-label="Game catalog">
        <Search />
        <FiltersOrders />
        <FilterChips />
        <SectionErrorBoundary>
          <section className="games-section" aria-label="Game results" aria-live="polite">
            {renderGameContent()}
          </section>
        </SectionErrorBoundary>
        <section className="featured-sections" aria-label="Featured games">
          <SectionErrorBoundary>
            <RecentGames />
          </SectionErrorBoundary>
          <SectionErrorBoundary>
            <UpcomingGames />
          </SectionErrorBoundary>
        </section>
      </main>
      <Footer />
    </div>
  );
}
