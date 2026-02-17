import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SiNintendogamecube } from 'react-icons/si';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaFire, FaStar } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { platformIcons } from '../utils/platformIcons';
import { getRecentGames } from '../Redux/actions';
import './Styles/RecentGames.css';
import './Styles/GameCardElements.css';
import defaultGameImage from '../img/default-game.jpg';

const RecentGames = () => {
    const dispatch = useDispatch();
    const recentGames = useSelector((state) => state.recentGames);
    const searchQuery = useSelector((state) => state.searchQuery);
    const loadingRecentGames = useSelector((state) => state.loadingRecentGames);
    const recentGamesError = useSelector((state) => state.recentGamesError);

    // Filtrar por búsqueda para que la búsqueda afecte toda la página
    const displayedGames = useMemo(() => {
        if (!recentGames?.length) return recentGames || [];
        if (!searchQuery?.trim()) return recentGames;
        const q = searchQuery.toLowerCase().trim();
        return recentGames.filter((g) => g.name?.toLowerCase().includes(q));
    }, [recentGames, searchQuery]);
    const scrollContainerRef = useRef(null);
    const [imageErrors, setImageErrors] = useState({});
    const [scrollProgress, setScrollProgress] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
    
    useEffect(() => {
        dispatch(getRecentGames());
    }, [dispatch]);

    const handleImageError = (gameId) => {
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

    const getDiffDays = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        const diffTime = date - today;
        return Math.round(diffTime / (1000 * 60 * 60 * 24));
    };

    const formatDate = (dateString) => {
        const diffDays = getDiffDays(dateString);
        
        if (diffDays === 0) return 'Today';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays >= -7 && diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        
        return `${month} ${day}, ${year}`;
    };

    const getDateBadgeClass = (dateString) => {
        const diffDays = getDiffDays(dateString);
        if (diffDays === 0) return 'date-badge--today';
        if (diffDays >= -3 && diffDays < 0) return 'date-badge--recent';
        if (diffDays >= -7 && diffDays < -3) return 'date-badge--week';
        return 'date-badge--older';
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.0) return '#4ade80';
        if (rating >= 3.0) return '#f6c90e';
        if (rating >= 2.0) return '#fb923c';
        return '#f87171';
    };

    const updateScrollState = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScroll = scrollWidth - clientWidth;
        
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft < maxScroll - 5);
        setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        updateScrollState();
        const resizeObserver = new ResizeObserver(updateScrollState);
        resizeObserver.observe(container);
        
        return () => resizeObserver.disconnect();
    }, [displayedGames, updateScrollState]);

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const cardWidth = 230;
            const gap = 14;
            const scrollAmount = direction === 'left' ? -(cardWidth + gap) * 2 : (cardWidth + gap) * 2;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handleScroll('left');
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleScroll('right');
        }
    }, []);

    const handleMouseDown = (e) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        dragState.current.isDown = true;
        dragState.current.startX = e.pageX - container.offsetLeft;
        dragState.current.scrollLeft = container.scrollLeft;
        container.style.scrollBehavior = 'auto';
    };

    const handleMouseMove = (e) => {
        if (!dragState.current.isDown) return;
        e.preventDefault();
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const x = e.pageX - container.offsetLeft;
        const walk = (x - dragState.current.startX) * 1.5;
        
        if (Math.abs(walk) > 5) {
            setIsDragging(true);
        }
        
        container.scrollLeft = dragState.current.scrollLeft - walk;
    };

    const handleMouseUp = () => {
        dragState.current.isDown = false;
        const container = scrollContainerRef.current;
        if (container) {
            container.style.scrollBehavior = 'smooth';
        }
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleMouseLeave = () => {
        dragState.current.isDown = false;
        const container = scrollContainerRef.current;
        if (container) {
            container.style.scrollBehavior = 'smooth';
        }
        setTimeout(() => setIsDragging(false), 50);
    };

    if (loadingRecentGames) {
        return (
            <section className="recent-games-section" aria-label="Recent games loading">
                <div className="rg-glass-container">
                    <div className="recent-games-container loading">
                        <div className="recent-games-header">
                            <div className="header-left">
                                <span className="game-icon"><SiNintendogamecube /></span>
                                <div className="header-titles">
                                    <h2>Gaming World Updates</h2>
                                    <span className="subtitle">Loading...</span>
                                </div>
                            </div>
                        </div>
                        <div className="loading-skeleton">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="skeleton-card-v2">
                                    <div className="skeleton-image-v2"></div>
                                    <div className="skeleton-content-v2">
                                        <div className="skeleton-badge"></div>
                                        <div className="skeleton-title-v2"></div>
                                        <div className="skeleton-platforms"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (recentGamesError) {
        return (
            <section className="recent-games-section">
                <div className="rg-glass-container">
                    <div className="recent-games-container error">
                        <div className="recent-games-header">
                            <div className="header-left">
                                <span className="game-icon"><SiNintendogamecube /></span>
                                <div className="header-titles">
                                    <h2>Gaming World Updates</h2>
                                    <span className="subtitle error">Failed to load</span>
                                </div>
                            </div>
                        </div>
                        <div className="error-state">
                            <p>{recentGamesError}</p>
                            <button 
                                className="retry-button"
                                onClick={() => dispatch(getRecentGames())}
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!displayedGames || displayedGames.length === 0) {
        return (
            <section className="recent-games-section">
                <div className="rg-glass-container">
                    <div className="recent-games-container">
                        <div className="recent-games-header">
                            <div className="header-left">
                                <span className="game-icon"><SiNintendogamecube /></span>
                                <div className="header-titles">
                                    <h2>Gaming World Updates</h2>
                                    <span className="subtitle">Recent Games</span>
                                </div>
                            </div>
                        </div>
                        <div className="empty-state">
                            <p>
                                {searchQuery
                                    ? `No recent games match "${searchQuery}".`
                                    : "No recent games available at this time."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section 
            className="recent-games-section" 
            aria-label="Recent games"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="rg-glass-container">
                <div className="recent-games-container">
                    <div className="recent-games-header">
                        <div className="header-left">
                            <span className="game-icon"><SiNintendogamecube /></span>
                            <div className="header-titles">
                                <h2>Gaming World Updates</h2>
                                <span className="subtitle">Recent Games</span>
                            </div>
                        </div>
                        <div className="header-right">
                            <span className="games-count-badge">
                                <FaFire className="count-icon" />
                                {displayedGames.length} {displayedGames.length === 1 ? 'game' : 'games'}
                            </span>
                            <div className="scroll-nav-buttons">
                                <button 
                                    className={`nav-btn nav-btn--prev ${!canScrollLeft ? 'nav-btn--disabled' : ''}`}
                                    onClick={() => handleScroll('left')}
                                    disabled={!canScrollLeft}
                                    aria-label="Previous"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button 
                                    className={`nav-btn nav-btn--next ${!canScrollRight ? 'nav-btn--disabled' : ''}`}
                                    onClick={() => handleScroll('right')}
                                    disabled={!canScrollRight}
                                    aria-label="Next"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="carousel-wrapper">
                        <div 
                            className={`scroll-fade scroll-fade--left ${canScrollLeft ? 'visible' : ''}`}
                            aria-hidden="true"
                        />
                        
                        <div 
                            className={`recent-games-grid ${isDragging ? 'is-dragging' : ''}`}
                            ref={scrollContainerRef}
                            onScroll={updateScrollState}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                        >
                            {displayedGames.map((game, index) => (
                                <Link 
                                    to={`/videogame/${game.id}`} 
                                    key={game.id} 
                                    className="game-card-v2"
                                    style={{ animationDelay: `${index * 0.06}s` }}
                                    onClick={(e) => { if (isDragging) e.preventDefault(); }}
                                    draggable={false}
                                >
                                    <div className="card-image-wrapper">
                                        <img 
                                            src={getImageSource(game)}
                                            alt={game.name}
                                            className="card-image"
                                            loading="lazy"
                                            draggable={false}
                                            onError={() => handleImageError(game.id)}
                                        />
                                        <div className="card-image-gradient" />
                                        
                                        {getDiffDays(game.released) === 0 && (
                                            <span className="new-badge">
                                                <FaFire /> NEW
                                            </span>
                                        )}
                                        
                                        {game.rating > 0 && (
                                            <span 
                                                className="rating-badge"
                                                style={{ 
                                                    '--rating-color': getRatingColor(game.rating),
                                                    '--rating-bg': `${getRatingColor(game.rating)}18`
                                                }}
                                            >
                                                <FaStar className="rating-star" />
                                                <span className="rating-value">{game.rating.toFixed(1)}</span>
                                            </span>
                                        )}
                                        
                                        <div className="card-hover-overlay">
                                            <span className="view-details-btn">View details</span>
                                        </div>

                                        <div className="card-body">
                                            <h3 className="card-title">{game.name}</h3>
                                            
                                            <div className={`date-badge ${getDateBadgeClass(game.released)}`}>
                                                <FaCalendarAlt className="date-badge-icon" />
                                                <span>{formatDate(game.released)}</span>
                                            </div>
                                            
                                            {game.genres && game.genres.length > 0 && (
                                                <div className="card-genres">
                                                    {game.genres.slice(0, 2).map((genre, idx) => (
                                                        <span key={idx} className="genre-chip">
                                                            {genre}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {game.platforms && game.platforms.length > 0 && (
                                                <div className="card-platforms">
                                                    {game.platforms.slice(0, 4).map((platform, idx) => (
                                                        <span key={idx} className="platform-chip" title={platform}>
                                                            <FontAwesomeIcon 
                                                                icon={platformIcons[platform] || platformIcons['Default']} 
                                                            />
                                                        </span>
                                                    ))}
                                                    {game.platforms.length > 4 && (
                                                        <span className="platform-chip platform-chip--more" title={`${game.platforms.length - 4} more`}>
                                                            +{game.platforms.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        
                        <div 
                            className={`scroll-fade scroll-fade--right ${canScrollRight ? 'visible' : ''}`}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="scroll-progress-track">
                        <div 
                            className="scroll-progress-fill" 
                            style={{ width: `${Math.max(scrollProgress, 5)}%` }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecentGames; 
