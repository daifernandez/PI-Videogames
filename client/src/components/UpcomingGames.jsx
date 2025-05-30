import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SiNintendogamecube } from 'react-icons/si';
import { getUpcomingGames } from '../Redux/actions';
import './Styles/RecentGames.css';

const UpcomingGames = () => {
    const dispatch = useDispatch();
    const upcomingGames = useSelector((state) => state.upcomingGames);
    const loading = useSelector((state) => state.loadingUpcoming);
    const error = useSelector((state) => state.errorUpcoming);

    useEffect(() => {
        dispatch(getUpcomingGames());
    }, [dispatch]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Si es hoy
        if (diffDays === 0) {
            return 'Disponible hoy';
        }
        
        // Si es mañana
        if (diffDays === 1) {
            return 'Disponible mañana';
        }
        
        // Si es esta semana
        if (diffDays <= 7) {
            return `En ${diffDays} días`;
        }
        
        // Si es este mes
        if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
            const day = date.getDate();
            const month = date.toLocaleString('es-ES', { month: 'short' });
            return `${day} ${month}`;
        }
        
        // Si es el próximo mes
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        if (date.getMonth() === nextMonth.getMonth() && date.getFullYear() === nextMonth.getFullYear()) {
            const day = date.getDate();
            const month = date.toLocaleString('es-ES', { month: 'short' });
            return `${day} ${month}`;
        }
        
        // Para fechas más lejanas
        const day = date.getDate();
        const month = date.toLocaleString('es-ES', { month: 'short' });
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
    };

    if (loading) {
        return (
            <div className="upcoming-games-container loading">
                <div className="upcoming-games-header">
                    <h2>
                        <span className="game-icon"><SiNintendogamecube /></span> 
                        Upcoming Games 
                        <span className="subtitle">Loading...</span>
                    </h2>
                </div>
                <div className="loading-skeleton">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="skeleton-card">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-title"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="upcoming-games-container error">
                <div className="upcoming-games-header">
                    <h2>
                        <span className="game-icon"><SiNintendogamecube /></span> 
                        Upcoming Games 
                        <span className="subtitle error">
                            There was an error loading the games. Please try again later.
                        </span>
                    </h2>
                </div>
            </div>
        );
    }

    if (!upcomingGames || upcomingGames.length === 0) {
        return (
            <div className="upcoming-games-container empty">
                <div className="upcoming-games-header">
                    <h2>
                        <span className="game-icon"><SiNintendogamecube /></span> 
                        Upcoming Games
                    </h2>
                </div>
                <div className="empty-state">
                    <p>No upcoming releases available at this time.</p>
                </div>
            </div>
        );
    }

    // Group games by month
    const groupedGames = upcomingGames.reduce((groups, game) => {
        const date = new Date(game.released);
        const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }
        groups[monthYear].push(game);
        return groups;
    }, {});

    return (
        <div className="upcoming-games-container">
            <div className="upcoming-games-header">
                <h2>
                    <span className="game-icon"><SiNintendogamecube /></span> 
                    Upcoming Games 
                    <span className="subtitle">Coming Soon</span>
                </h2>
            </div>
            <div className="upcoming-games-list" role="list" aria-label="List of upcoming releases">
                {Object.entries(groupedGames).map(([monthYear, games]) => {
                    const [month, year] = monthYear.split(' ');
                    return (
                        <div key={monthYear} className="month-group" role="group" aria-label={monthYear}>
                            <div className="month-header-container">
                                <div className="month-year-badge">
                                    <span className="month">{month}</span>
                                    <span className="year">{year}</span>
                                </div>
                                <div className="month-stats">
                                    <span className="games-count">
                                        {games.length} {games.length === 1 ? 'game' : 'games'}
                                    </span>
                                </div>
                            </div>
                            <div className="games-list">
                                {games.map((game) => (
                                    <Link 
                                        to={`/videogame/${game.id}`} 
                                        key={game.id} 
                                        className="game-list-item"
                                        role="listitem"
                                        aria-label={`${game.name}, release date: ${formatDate(game.released)}`}
                                    >
                                        <div className="game-image-container">
                                            <img 
                                                src={game.image} 
                                                alt={game.name}
                                                className="game-thumbnail"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder-game.jpg';
                                                }}
                                            />
                                            <div className="game-hover-info">
                                                <span className="view-details">View Details</span>
                                            </div>
                                        </div>
                                        <div className="game-info">
                                            <div className="game-title-container">
                                                <h4 className="game-title">{game.name}</h4>
                                                <span className="release-date" title={`Release date: ${formatDate(game.released)}`}>
                                                    {formatDate(game.released)}
                                                </span>
                                            </div>
                                            {game.platforms && game.platforms.length > 0 && (
                                                <div className="platforms-list" aria-label="Available platforms">
                                                    {game.platforms.slice(0, 3).map((platform, index) => (
                                                        <span 
                                                            key={index} 
                                                            className="platform-tag"
                                                            title={platform}
                                                        >
                                                            {platform}
                                                        </span>
                                                    ))}
                                                    {game.platforms.length > 3 && (
                                                        <span className="platform-tag more" title="More platforms available">
                                                            +{game.platforms.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UpcomingGames; 
