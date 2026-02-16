import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaRocket, FaStar, FaClock, FaFire, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { platformIcons } from '../utils/platformIcons';
import { getUpcomingGames } from '../Redux/actions';
import './Styles/UpcomingGames.css';
import './Styles/GameCardElements.css';
import defaultGameImage from '../img/default-game.jpg';

const UpcomingGames = () => {
    const dispatch = useDispatch();
    const upcomingGames = useSelector((state) => state.upcomingGames);
    const loading = useSelector((state) => state.loadingUpcoming);
    const error = useSelector((state) => state.errorUpcoming);
    const [imageErrors, setImageErrors] = useState({});
    const [expandedMonths, setExpandedMonths] = useState({});

    useEffect(() => {
        dispatch(getUpcomingGames());
    }, [dispatch]);

    useEffect(() => {
        if (upcomingGames && upcomingGames.length > 0) {
            const grouped = groupByMonth(upcomingGames);
            const initial = {};
            Object.keys(grouped).forEach((key, idx) => {
                initial[key] = idx < 3;
            });
            setExpandedMonths(initial);
        }
    }, [upcomingGames]);

    const handleImageError = (gameId) => {
        setImageErrors(prev => ({ ...prev, [gameId]: true }));
    };

    const getImageSource = (game) => {
        if (imageErrors[game.id] || !game.image) return defaultGameImage;
        return game.image;
    };

    const toggleMonth = (monthKey) => {
        setExpandedMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }));
    };

    const getDiffDays = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        return Math.round((date - today) / (1000 * 60 * 60 * 24));
    };

    const formatDate = (dateString) => {
        const diffDays = getDiffDays(dateString);
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays <= 7 && diffDays > 1) return `In ${diffDays} days`;
        
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        const currentYear = new Date().getFullYear();
        
        return year === currentYear ? `${month} ${day}` : `${month} ${day}, ${year}`;
    };

    const getCountdownClass = (dateString) => {
        const diffDays = getDiffDays(dateString);
        if (diffDays <= 0) return 'countdown--now';
        if (diffDays <= 3) return 'countdown--soon';
        if (diffDays <= 7) return 'countdown--week';
        if (diffDays <= 30) return 'countdown--month';
        return 'countdown--later';
    };

    const getCountdownIcon = (dateString) => {
        const diffDays = getDiffDays(dateString);
        if (diffDays <= 0) return <FaFire />;
        if (diffDays <= 7) return <FaClock />;
        return <FaCalendarAlt />;
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.0) return '#4ade80';
        if (rating >= 3.0) return '#f6c90e';
        if (rating >= 2.0) return '#fb923c';
        return '#f87171';
    };

    const groupByMonth = (games) => {
        return games.reduce((groups, game) => {
            const date = new Date(game.released);
            const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
            const label = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            if (!groups[key]) {
                groups[key] = { label, month: date.toLocaleString('en-US', { month: 'long' }), year: date.getFullYear(), games: [] };
            }
            groups[key].games.push(game);
            return groups;
        }, {});
    };

    const totalGames = upcomingGames ? upcomingGames.length : 0;

    if (loading) {
        return (
            <section className="upcoming-section" aria-label="Upcoming releases loading">
                <div className="ug-glass-container">
                    <div className="ug-container">
                        <div className="ug-header">
                            <div className="header-left">
                                <span className="ug-icon"><FaRocket /></span>
                                <div className="header-titles">
                                    <h2>Upcoming Releases</h2>
                                    <span className="ug-subtitle">Loading...</span>
                                </div>
                            </div>
                        </div>
                        <div className="ug-skeleton-grid">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="ug-skeleton-card">
                                    <div className="ug-skeleton-image"></div>
                                    <div className="ug-skeleton-body">
                                        <div className="ug-skeleton-line ug-skeleton-line--title"></div>
                                        <div className="ug-skeleton-line ug-skeleton-line--badge"></div>
                                        <div className="ug-skeleton-line ug-skeleton-line--chips"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="upcoming-section">
                <div className="ug-glass-container">
                    <div className="ug-container">
                        <div className="ug-header">
                            <div className="header-left">
                                <span className="ug-icon"><FaRocket /></span>
                                <div className="header-titles">
                                    <h2>Upcoming Releases</h2>
                                    <span className="ug-subtitle ug-subtitle--error">Error</span>
                                </div>
                            </div>
                        </div>
                        <div className="ug-error-state">
                            <FaRocket className="ug-error-icon" />
                            <p>Could not load upcoming releases.</p>
                            <button className="ug-retry-btn" onClick={() => dispatch(getUpcomingGames())}>
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!upcomingGames || upcomingGames.length === 0) {
        return (
            <section className="upcoming-section">
                <div className="ug-glass-container">
                    <div className="ug-container">
                        <div className="ug-header">
                            <div className="header-left">
                                <span className="ug-icon"><FaRocket /></span>
                                <div className="header-titles">
                                    <h2>Upcoming Releases</h2>
                                    <span className="ug-subtitle">Coming Soon</span>
                                </div>
                            </div>
                        </div>
                        <div className="ug-empty-state">
                            <p>No upcoming releases available.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const groupedGames = groupByMonth(upcomingGames);

    return (
        <section className="upcoming-section" aria-label="Upcoming releases">
            <div className="ug-glass-container">
                <div className="ug-container">
                    <div className="ug-header">
                        <div className="header-left">
                            <span className="ug-icon"><FaRocket /></span>
                            <div className="header-titles">
                                <h2>Upcoming Releases</h2>
                                <span className="ug-subtitle">Coming Soon</span>
                            </div>
                        </div>
                        <div className="header-right">
                            <span className="ug-total-badge">
                                <FaCalendarAlt className="ug-total-icon" />
                                {totalGames} {totalGames === 1 ? 'game' : 'games'}
                            </span>
                        </div>
                    </div>

                    <div className="ug-timeline">
                        {Object.entries(groupedGames).map(([key, group], groupIdx) => {
                            const isExpanded = expandedMonths[key] !== false;
                            return (
                                <div key={key} className="ug-month-group" style={{ animationDelay: `${groupIdx * 0.1}s` }}>
                                    <button 
                                        className={`ug-month-header ${isExpanded ? 'ug-month-header--expanded' : ''}`}
                                        onClick={() => toggleMonth(key)}
                                        aria-expanded={isExpanded}
                                    >
                                        <div className="ug-month-badge">
                                            <span className="ug-month-name">{group.month}</span>
                                            <span className="ug-month-year">{group.year}</span>
                                        </div>
                                        <div className="ug-month-meta">
                                            <span className="ug-month-count">
                                                {group.games.length} {group.games.length === 1 ? 'game' : 'games'}
                                            </span>
                                            <span className="ug-month-toggle">
                                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                            </span>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="ug-games-grid">
                                            {group.games.map((game, idx) => (
                                                <Link
                                                    to={`/videogame/${game.id}`}
                                                    key={game.id}
                                                    className="ug-card"
                                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                                >
                                                    <div className="ug-card-image">
                                                        <img
                                                            src={getImageSource(game)}
                                                            alt={game.name}
                                                            loading="lazy"
                                                            draggable={false}
                                                            onError={() => handleImageError(game.id)}
                                                        />
                                                        <div className="ug-card-gradient" />

                                                        <span className={`ug-countdown ${getCountdownClass(game.released)}`}>
                                                            {getCountdownIcon(game.released)}
                                                            <span>{formatDate(game.released)}</span>
                                                        </span>

                                                        {game.rating > 0 && (
                                                            <span
                                                                className="ug-rating"
                                                                style={{
                                                                    '--r-color': getRatingColor(game.rating),
                                                                    '--r-bg': `${getRatingColor(game.rating)}18`
                                                                }}
                                                            >
                                                                <FaStar className="ug-rating-star" />
                                                                {game.rating.toFixed(1)}
                                                            </span>
                                                        )}

                                                        <div className="ug-card-hover">
                                                            <span className="ug-view-btn">View details</span>
                                                        </div>
                                                    </div>

                                                    <div className="ug-card-body">
                                                        <h3 className="ug-card-title">{game.name}</h3>

                                                        {game.genres && game.genres.length > 0 && (
                                                            <div className="ug-card-genres">
                                                                {game.genres.slice(0, 2).map((genre, i) => (
                                                                    <span key={i} className="ug-genre">{genre}</span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {game.platforms && game.platforms.length > 0 && (
                                                            <div className="ug-card-platforms">
                                                                {game.platforms.slice(0, 5).map((platform, i) => (
                                                                    <span key={i} className="ug-platform" title={platform}>
                                                                        <FontAwesomeIcon
                                                                            icon={platformIcons[platform] || platformIcons['Default']}
                                                                        />
                                                                    </span>
                                                                ))}
                                                                {game.platforms.length > 5 && (
                                                                    <span className="ug-platform ug-platform--more">
                                                                        +{game.platforms.length - 5}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpcomingGames;
