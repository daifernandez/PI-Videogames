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
  const [currentPage, setCurrentPage] = useState(0);
  const gamesPerPage = 12;

  useEffect(() => {
    if (allVideogames.length === 0) {
      dispatch(getvideogames());
    }
  }, [dispatch, allVideogames.length]);

  const filteredGames = allVideogames.filter(game => 
    game.platforms.some(p => p.toLowerCase() === decodeURIComponent(platform).toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastGame = (currentPage + 1) * gamesPerPage;
  const indexOfFirstGame = currentPage * gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const handlePageChange = (pageNumber) => {
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
                  <nav>
                    <div className="pagination">
                      <div>
                        <button
                          className="pagination-NextPrevious"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                        >
                          <span className="material-symbols-rounded extra-left-padding">
                            arrow_back_ios
                          </span>
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            className={
                              currentPage === index
                                ? "pagination-button-current"
                                : "pagination-button"
                            }
                            key={index}
                            onClick={() => handlePageChange(index)}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          className="pagination-NextPrevious"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages - 1}
                        >
                          <span className="material-symbols-rounded">arrow_forward_ios</span>
                        </button>
                      </div>
                    </div>
                  </nav>
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
