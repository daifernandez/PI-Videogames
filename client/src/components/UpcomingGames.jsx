import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaRocket, FaClock, FaFire, FaChevronDown, FaChevronUp, FaSearch, FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { platformIcons } from '../utils/platformIcons';
import { getUpcomingGames } from '../Redux/actions';
import './Styles/UpcomingGames.css';
import './Styles/GameCardElements.css';
import defaultGameImage from '../img/default-game.jpg';

const UpcomingGames = () => {
    const dispatch = useDispatch();
    const upcomingGames = useSelector((state) => state.upcomingGames);
    const searchQuery = useSelector((state) => state.searchQuery);
    const loading = useSelector((state) => state.loadingUpcoming);
    const error = useSelector((state) => state.errorUpcoming);
    const [imageErrors, setImageErrors] = useState({});
    const [localSearch, setLocalSearch] = useState('');

    // Buscador local tiene prioridad; si está vacío, usa el buscador global
    const searchFilter = (localSearch?.trim() || searchQuery?.trim() || '').toLowerCase();
    const displayedGames = useMemo(() => {
        if (!upcomingGames?.length) return upcomingGames || [];
        if (!searchFilter) return upcomingGames;
        return upcomingGames.filter((g) => g.name?.toLowerCase().includes(searchFilter));
    }, [upcomingGames, searchFilter]);
    const [expandedMonths, setExpandedMonths] = useState({});

    useEffect(() => {
        dispatch(getUpcomingGames());
    }, [dispatch]);

    useEffect(() => {
        if (displayedGames && displayedGames.length > 0) {
            const after = displayedGames.filter((g) => getDiffDays(g.released) > 7);
            const grouped = groupByMonth(after);
            const initial = {};
            Object.keys(grouped).forEach((key, idx) => {
                initial[key] = idx < 5;
            });
            setExpandedMonths(initial);
        }
    }, [displayedGames]);

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

    const formatFullDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
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

    const thisWeekGames = useMemo(() => {
        if (!displayedGames?.length) return [];
        return displayedGames.filter((g) => getDiffDays(g.released) >= 0 && getDiffDays(g.released) <= 7);
    }, [displayedGames]);

    const gamesAfterThisWeek = useMemo(() => {
        if (!displayedGames?.length) return displayedGames;
        return displayedGames.filter((g) => getDiffDays(g.released) > 7);
    }, [displayedGames]);

    const groupedGames = groupByMonth(gamesAfterThisWeek || []);
    const allExpanded = useMemo(() => {
        return Object.keys(groupedGames).every((key) => expandedMonths[key] !== false);
    }, [expandedMonths, groupedGames]);

    const expandOrCollapseAll = () => {
        const grouped = groupByMonth(gamesAfterThisWeek || []);
        const next = !allExpanded;
        const nextState = {};
        Object.keys(grouped).forEach((k) => { nextState[k] = next; });
        setExpandedMonths(nextState);
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

    const totalGames = displayedGames ? displayedGames.length : 0;

    const dateRangeSubtitle = useMemo(() => {
        const keys = Object.keys(groupedGames);
        if (keys.length === 0) return 'Coming Soon';
        const first = keys[0], last = keys[keys.length - 1];
        const firstMonth = first ? first.slice(5, 7) : '', firstYear = first ? first.slice(0, 4) : '';
        const lastMonth = last ? last.slice(5, 7) : '', lastYear = last ? last.slice(0, 4) : '';
        const fm = firstMonth ? new Date(2000, parseInt(firstMonth, 10) - 1).toLocaleString('en-US', { month: 'short' }) : '';
        const lm = lastMonth ? new Date(2000, parseInt(lastMonth, 10) - 1).toLocaleString('en-US', { month: 'short' }) : '';
        if (firstYear === lastYear && fm && lm) return `${fm} – ${lm} ${firstYear}`;
        if (fm && lm) return `${fm} ${firstYear} – ${lm} ${lastYear}`;
        return 'Coming Soon';
    }, [groupedGames]);

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

    if (!displayedGames || displayedGames.length === 0) {
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
                            <div className="header-right ug-header-actions">
                                <div className="ug-search-wrap">
                                    <FaSearch className="ug-search-icon" aria-hidden />
                                    <input
                                        type="search"
                                        className="ug-search-input"
                                        placeholder="Search upcoming..."
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                        aria-label="Search upcoming releases"
                                    />
                                </div>
                                <span className="ug-total-badge">
                                    <FaCalendarAlt className="ug-total-icon" />
                                    0 games
                                </span>
                            </div>
                        </div>
                        <div className="ug-empty-state">
                            <p>
                                {searchFilter
                                    ? `No upcoming games match "${searchFilter}".`
                                    : "No upcoming releases available."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="upcoming-section" aria-label="Upcoming releases">
            <div className="ug-glass-container">
                <div className="ug-container">
                    <div className="ug-header">
                        <div className="header-left">
                            <span className="ug-icon"><FaRocket /></span>
                            <div className="header-titles">
                                <h2>Upcoming Releases</h2>
                                <span className="ug-subtitle">{dateRangeSubtitle}</span>
                            </div>
                        </div>
                        <div className="header-right ug-header-actions">
                            <div className="ug-search-wrap">
                                <FaSearch className="ug-search-icon" aria-hidden />
                                <input
                                    type="search"
                                    className="ug-search-input"
                                    placeholder="Search upcoming..."
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                    aria-label="Search upcoming releases"
                                />
                            </div>
                            {Object.keys(groupedGames).length > 1 && (
                                <button
                                    type="button"
                                    className="ug-expand-toggle"
                                    onClick={expandOrCollapseAll}
                                    aria-label={allExpanded ? 'Collapse all months' : 'Expand all months'}
                                    title={allExpanded ? 'Collapse all' : 'Expand all'}
                                >
                                    {allExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
                                    <span>{allExpanded ? 'Collapse' : 'Expand'} all</span>
                                </button>
                            )}
                            <span className="ug-total-badge">
                                <FaCalendarAlt className="ug-total-icon" />
                                {totalGames} {totalGames === 1 ? 'game' : 'games'}
                            </span>
                        </div>
                    </div>

                    {thisWeekGames.length > 0 && (
                        <div className="ug-this-week">
                            <h3 className="ug-this-week__title">
                                <FaClock className="ug-this-week__icon" />
                                This week
                            </h3>
                            <div className="ug-this-week__grid">
                                {thisWeekGames.map((game, idx) => (
                                    <Link
                                        to={`/videogame/${game.id}`}
                                        key={game.id}
                                        className="ug-card ug-card--spotlight"
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
                                            <span className={`ug-countdown ${getCountdownClass(game.released)}`} title={formatFullDate(game.released)}>
                                                {getCountdownIcon(game.released)}
                                                <span>{formatDate(game.released)}</span>
                                            </span>
                                            <div className="ug-card-hover">
                                                <span className="ug-view-btn">View details</span>
                                            </div>
                                        </div>
                                        <div className="ug-card-body">
                                            <h3 className="ug-card-title">{game.name}</h3>
                                            {game.genres?.length > 0 && (
                                                <div className="ug-card-genres">
                                                    {game.genres.slice(0, 2).map((genre, i) => (
                                                        <span key={i} className="ug-genre">{genre}</span>
                                                    ))}
                                                </div>
                                            )}
                                            {game.platforms?.length > 0 && (
                                                <div className="ug-card-platforms">
                                                    {game.platforms.slice(0, 5).map((platform, i) => (
                                                        <span key={i} className="ug-platform" title={platform}>
                                                            <FontAwesomeIcon icon={platformIcons[platform] || platformIcons['Default']} />
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {Object.keys(groupedGames).length > 0 && (
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

                                                        <span className={`ug-countdown ${getCountdownClass(game.released)}`} title={formatFullDate(game.released)}>
                                                            {getCountdownIcon(game.released)}
                                                            <span>{formatDate(game.released)}</span>
                                                        </span>

                                                        {/* Hide rating: upcoming games haven't been released yet */}
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
                    )}
                </div>
            </div>
        </section>
    );
};

export default UpcomingGames;
