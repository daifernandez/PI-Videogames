import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SiNintendogamecube } from 'react-icons/si';
import { FaCalendarAlt } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { platformIcons } from '../utils/platformIcons';
import { getRecentGames } from '../Redux/actions';
import './Styles/RecentGames.css';
import './Styles/GameCardElements.css';
import defaultGameImage from '../img/default-game.jpg';

const RecentGames = () => {
    const dispatch = useDispatch();
    const recentGames = useSelector((state) => state.recentGames);
    const loadingRecentGames = useSelector((state) => state.loadingRecentGames);
    const recentGamesError = useSelector((state) => state.recentGamesError);
    const scrollContainerRef = useRef(null);
    const [imageErrors, setImageErrors] = useState({});
    
    useEffect(() => {
        dispatch(getRecentGames());
    }, [dispatch]);

    const handleImageError = (gameId) => {
        console.log('Error loading image for game:', gameId);
        setImageErrors(prev => ({
            ...prev,
            [gameId]: true
        }));
    };

    const getImageSource = (game) => {
        if (imageErrors[game.id] || !game.image) {
            return defaultGameImage;
        }
        return game.image;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Available today';
        if (diffDays === -1) return 'Available yesterday';
        if (diffDays >= -7 && diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        
        return `${month} ${day}, ${year}`;
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
            <div className="recent-games-container loading">
                <div className="recent-games-header">
                    <h2>
                        <span className="game-icon"><SiNintendogamecube /></span>
                        Gaming World Updates
                        <span className="subtitle">Loading...</span>
                    </h2>
                </div>
                <div className="loading-skeleton">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-title"></div>
                                <div className="skeleton-text"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (recentGamesError) {
        return (
            <div className="recent-games-container error">
                <div className="recent-games-header">
                    <h2>
                        <span className="game-icon"><SiNintendogamecube /></span>
                        Gaming World Updates
                        <span className="subtitle error">Error al cargar</span>
                    </h2>
                </div>
                <p className="error-message">{recentGamesError}</p>
            </div>
        );
    }

    if (!recentGames || recentGames.length === 0) {
        return (
            <div className="recent-games-container">
                <div className="recent-games-header">
                    <h2>
                        <span className="game-icon"><SiNintendogamecube /></span>
                        Gaming World Updates
                        <span className="subtitle">Juegos Recientes</span>
                    </h2>
                </div>
                <div className="empty-state">
                    <p>No hay juegos recientes disponibles en este momento.</p>
                </div>
            </div>
        );
    }

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
                <h2>
                    <span className="game-icon"><SiNintendogamecube /></span>
                    Gaming World Updates
                    <span className="subtitle">Recent Games</span>
                </h2>
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
                        <div className="game-card-image-container">
                            <img 
                                src={getImageSource(game)}
                                alt={game.name}
                                className="game-card-image"
                                loading="lazy"
                                onError={() => handleImageError(game.id)}
                            />
                            <div className="game-card-overlay">
                                <span className="view-details">View details</span>
                            </div>
                        </div>
                        <div className="game-card-content">
                            <h3 className="game-card-title">{game.name}</h3>
                            <div className="game-card-info">
                                <div className="release-date" title={`Release date: ${formatDate(game.released)}`}>
                                    <FaCalendarAlt className="date-icon" />
                                    {formatDate(game.released)}
                                </div>
                            </div>
                            {game.platforms && game.platforms.length > 0 && (
                                <div className="game-card-platforms">
                                    <div className="platforms-container">
                                        {game.platforms.slice(0, 4).map((platform, index) => (
                                            <span key={index} className="platform-icon" title={platform}>
                                                <FontAwesomeIcon 
                                                    icon={platformIcons[platform] || platformIcons['Default']} 
                                                />
                                            </span>
                                        ))}
                                        {game.platforms.length > 4 && (
                                            <span className="platform-icon more" title={`${game.platforms.length - 4} more platforms`}>
                                                +{game.platforms.length - 4}
                                            </span>
                                        )}
                                    </div>
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
