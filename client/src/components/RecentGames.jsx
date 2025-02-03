import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SiNintendogamecube } from 'react-icons/si';
import { getRecentGames } from '../Redux/actions';
import './Styles/RecentGames.css';

const RecentGames = () => {
    const dispatch = useDispatch();
    const { recentGames, loadingRecentGames, recentGamesError } = useSelector((state) => state);
    const scrollContainerRef = useRef(null);
    
    useEffect(() => {
        dispatch(getRecentGames());
    }, [dispatch]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -340 : 340;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loadingRecentGames) {
        return (
            <div className="recent-games-container">
                <div className="recent-games-header">
                    <h2><span className="game-icon"><SiNintendogamecube /></span> Gaming World Updates <span className="subtitle">Cargando...</span></h2>
                </div>
            </div>
        );
    }

    if (recentGamesError) {
        return (
            <div className="recent-games-container">
                <div className="recent-games-header">
                    <h2><span className="game-icon"><SiNintendogamecube /></span> Gaming World Updates <span className="subtitle">Error al cargar</span></h2>
                </div>
                <p className="error-message">{recentGamesError}</p>
            </div>
        );
    }

    if (!recentGames || recentGames.length === 0) return null;

    return (
        <div className="recent-games-container"
             onMouseEnter={() => {
                 const container = scrollContainerRef.current;
                 if (container) {
                     const canScrollLeft = container.scrollLeft > 0;
                     const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);
                     if (canScrollLeft) container.parentElement.classList.add('can-scroll-left');
                     if (canScrollRight) container.parentElement.classList.add('can-scroll-right');
                 }
             }}
             onMouseLeave={() => {
                 const container = scrollContainerRef.current;
                 if (container) {
                     container.parentElement.classList.remove('can-scroll-left', 'can-scroll-right');
                 }
             }}
        >
            <div className="recent-games-header">
                <h2><span className="game-icon"><SiNintendogamecube /></span> Gaming World Updates <span className="subtitle">Últimos Lanzamientos</span></h2>
            </div>
            <div 
                className="recent-games-grid" 
                ref={scrollContainerRef}
                onScroll={() => {
                    const container = scrollContainerRef.current;
                    if (container) {
                        const canScrollLeft = container.scrollLeft > 0;
                        const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);
                        container.parentElement.classList.toggle('can-scroll-left', canScrollLeft);
                        container.parentElement.classList.toggle('can-scroll-right', canScrollRight);
                    }
                }}
            >
                {recentGames.map((game) => (
                    <Link to={`/videogame/${game.id}`} key={game.id} className="game-card">
                        <img 
                            src={game.image} 
                            alt={game.name}
                            className="game-card-image"
                            loading="lazy"
                        />
                        <div className="game-card-content">
                            <h3 className="game-card-title">{game.name}</h3>
                            <div className="game-card-info">
                                <div className="game-card-rating">
                                    ⭐ {game.rating?.toFixed(1) || '0.0'}
                                </div>
                                <div>{formatDate(game.released)}</div>
                            </div>
                            {game.genres && game.genres.length > 0 && (
                                <div className="game-card-genres">
                                    {game.genres.slice(0, 3).map((genre, index) => (
                                        <span key={index} className="game-card-genre">
                                            {typeof genre === 'string' ? genre : genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
            <div className="scroll-indicators">
                <button 
                    className="scroll-button left" 
                    onClick={() => handleScroll('left')}
                    aria-label="Desplazar a la izquierda"
                >
                    ←
                </button>
                <button 
                    className="scroll-button right" 
                    onClick={() => handleScroll('right')}
                    aria-label="Desplazar a la derecha"
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default RecentGames; 
