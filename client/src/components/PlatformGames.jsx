import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getvideogames } from '../Redux/actions';
import NavBar from './NavBar';
import Cards from './Cards';
import Loading from './Loading';
import Paginado from './Paginado';
import ScrollToTop from './ScrollToTop';
import './Styles/Cards.css';
import './Styles/PlatformGames.css';
import './Styles/Paginado.css';

export default function PlatformGames() {
  const { platform } = useParams();
  const dispatch = useDispatch();
  const allVideogames = useSelector((state) => state.videogames);
  const loading = useSelector((state) => state.loading);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage, setGamesPerPage] = useState(12);

  useEffect(() => {
    if (allVideogames.length === 0) {
      dispatch(getvideogames());
    }
  }, [dispatch, allVideogames.length]);

  const filteredGames = allVideogames.filter(game => 
    game.platforms.some(p => p.toLowerCase() === decodeURIComponent(platform).toLowerCase())
  );

  // Ajustar gamesPerPage según la cantidad de juegos
  useEffect(() => {
    if (filteredGames.length <= 8) {
      setGamesPerPage(8);
    } else if (filteredGames.length <= 12) {
      setGamesPerPage(12);
    } else if (filteredGames.length <= 16) {
      setGamesPerPage(16);
    } else {
      setGamesPerPage(12);
    }
    setCurrentPage(1); // Reset a la primera página cuando cambia la cantidad
  }, [filteredGames.length]);

  // Lógica de paginación
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const paginado = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="loading-container">
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <ScrollToTop />
      <div className="platform-games">
        <div className="platform-header">
          <h1 className="platform-title">{decodeURIComponent(platform)}</h1>
          <div className="platform-stats">
            <span className="games-count">
              {filteredGames.length === 0 
                ? 'No games available' 
                : `${filteredGames.length} ${filteredGames.length === 1 ? 'game available' : 'games available'}`}
            </span>
          </div>
        </div>
        <div className="platform-cards-container">
          {filteredGames.length > 0 ? (
            <>
              <Cards videogames={currentGames} direction="vertical" />
              {filteredGames.length > gamesPerPage && (
                <div className="pagination">
                  <Paginado
                    gamesPerPage={gamesPerPage}
                    allGames={filteredGames.length}
                    paginado={paginado}
                    currentPage={currentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="no-games-found">
              <h2>No games found</h2>
              <p>We couldn't find any games for {decodeURIComponent(platform)}.</p>
              <p>Try searching on another platform or come back later.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 
