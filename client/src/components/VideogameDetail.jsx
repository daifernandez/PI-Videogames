import axios from "axios";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createSelector } from "reselect";
import { getvideogames } from "../Redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { platformIcons } from "../utils/platformIcons";
import NavBar from "./NavBar";
import ScrollToTop from "./ScrollToTop";
import RatingCircle from "./RatingCircle";
import Breadcrumbs from "./Breadcrumbs";
import MediaGallery from "./MediaGallery";
import SimilarGames from "./SimilarGames";
import PriceComparison from "./PriceComparison";
import ImagePlaceholder from "./ImagePlaceholder.jsx";
import "./Styles/VideogameDetail.css";
import banner from "../img/banner.jpg";

const apiUrl = process.env.REACT_APP_API_HOST;

const selectVideogames = (state) => state.videogames;
const selectDetailVideogame = (_, detail) => detail;

const selectSameGenreVideogames = createSelector(
  [selectVideogames, selectDetailVideogame],
  (videogames, detail) => {
    if (!detail || !videogames) return [];
    return videogames
      .filter(
        (vg) =>
          vg.genres?.some((g) =>
            detail.genres?.includes(typeof g === "string" ? g : g.name)
          ) && vg.id !== detail.id
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }
);

async function fetchDetail(id) {
  const res = await axios.get(`${apiUrl}/videogame/${id}`);
  return res.data;
}

const TABS = [
  { id: "about", label: "About", icon: "info" },
  { id: "media", label: "Media", icon: "photo_library" },
  { id: "similar", label: "Similar", icon: "sports_esports" },
];

const tabContentVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function VideogameDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [mediaType, setMediaType] = useState("screenshots");
  const [heroOffset, setHeroOffset] = useState(0);

  const heroRef = useRef(null);

  const sameGenreGames = useSelector((state) =>
    selectSameGenreVideogames(state, game)
  );
  const hasVideogames = useSelector((state) => state.videogames.length > 0);

  useEffect(() => {
    setGame(null);
    setIsLoading(true);
    setActiveTab("about");

    fetchDetail(id)
      .then((data) => setGame(data))
      .catch((err) => console.error("Error fetching detail:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!hasVideogames) dispatch(getvideogames());
  }, [dispatch, hasVideogames]);

  const handleScroll = useCallback(() => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setHeroOffset(Math.max(0, -rect.top * 0.35));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handlePlatformClick = (platform) => {
    navigate(`/platform/${encodeURIComponent(platform)}`);
  };

  const breadcrumbItems = useMemo(() => {
    if (!game) return [];
    const items = [];
    const firstGenre = game.genres?.[0];
    if (firstGenre) {
      const genreName = typeof firstGenre === "string" ? firstGenre : firstGenre.name;
      items.push({ label: genreName });
    }
    items.push({ label: game.name });
    return items;
  }, [game]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* ──────── Loading state ──────── */
  if (isLoading) {
    return (
      <div className="vd-page">
        <NavBar />
        <div className="vd-loading">
          <div className="vd-loading__hero" />
          <div className="vd-loading__content">
            <div className="vd-loading__bar vd-loading__bar--lg" />
            <div className="vd-loading__bar vd-loading__bar--sm" />
            <div className="vd-loading__bar vd-loading__bar--md" />
          </div>
        </div>
      </div>
    );
  }

  /* ──────── Error state ──────── */
  if (!game) {
    return (
      <div className="vd-page">
        <NavBar />
        <div className="vd-error">
          <span className="material-symbols-rounded vd-error__icon">
            sports_esports
          </span>
          <h2 className="vd-error__title">Game not found</h2>
          <p className="vd-error__text">
            We couldn't load this game. It may have been removed or the link is invalid.
          </p>
          <button className="vd-error__btn" onClick={() => navigate(-1)}>
            <span className="material-symbols-rounded">arrow_back</span>
            Go back
          </button>
        </div>
      </div>
    );
  }

  /* ──────── Main render ──────── */
  return (
    <div className="vd-page">
      <ScrollToTop />
      <NavBar />

      {/* ── Hero ── */}
      <section className="vd-hero" ref={heroRef}>
        <div
          className="vd-hero__bg"
          style={{ transform: `translateY(${heroOffset}px)` }}
        >
          <ImagePlaceholder
            src={game.image || banner}
            alt={game.name}
            name={game.name}
            className="vd-hero__bg-img"
          />
        </div>
        <div className="vd-hero__overlay" />

        <motion.div
          className="vd-hero__content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Title */}
          <h1 className="vd-hero__title">{game.name}</h1>

          {/* Line 2: All metadata inline */}
          <div className="vd-hero__meta">
            {game.rating > 0 && (
              <span className="vd-hero__rating" data-quality={
                game.rating >= 4 ? "high" : game.rating >= 3 ? "mid" : "low"
              }>
                {parseFloat(game.rating).toFixed(1)}
              </span>
            )}

            {game.genres?.length > 0 && (
              <span className="vd-hero__genres">
                {game.genres.slice(0, 2).join(" · ")}
              </span>
            )}

            {game.released && (
              <>
                <span className="vd-hero__dot">·</span>
                <span className="vd-hero__date">{formatDate(game.released)}</span>
              </>
            )}
          </div>

          {/* Line 3: Actions */}
          <div className="vd-hero__actions">
            {game.website && game.website.startsWith("http") && (
              <a
                href={game.website}
                target="_blank"
                rel="noopener noreferrer"
                className="vd-hero__link"
              >
                <span className="material-symbols-rounded">open_in_new</span>
                Website
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <div className="vd-content">
        <motion.div
          className="vd-body"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Tabs */}
          <motion.div
            className="vd-tabs"
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`vd-tab ${activeTab === tab.id ? "vd-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="material-symbols-rounded vd-tab__icon">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "about" && (
              <motion.div
                key="about"
                variants={tabContentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="vd-tab-content"
              >
                {/* Rating summary bar */}
                <div className="vd-rating-bar">
                  <RatingCircle rating={game.rating} />
                  <div className="vd-rating-bar__info">
                    {game.platforms?.length > 0 && (
                      <span className="vd-rating-bar__detail">
                        {game.platforms.length} platform{game.platforms.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {game.genres?.length > 0 && (
                      <span className="vd-rating-bar__detail">
                        {game.genres.join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <section className="vd-section">
                  <h2 className="vd-section__title">Description</h2>
                  <div
                    className="vd-description"
                    dangerouslySetInnerHTML={{
                      __html: game.description?.replace(/\n/g, "<br />") || "",
                    }}
                  />
                </section>

                {/* Credits */}
                {(game.developers?.length > 0 || game.publishers?.length > 0) && (
                  <section className="vd-credits">
                    {game.developers?.length > 0 && (
                      <div className="vd-credit">
                        <span className="vd-credit__label">Developers</span>
                        <span className="vd-credit__value">
                          {game.developers.join(", ")}
                        </span>
                      </div>
                    )}
                    {game.publishers?.length > 0 && (
                      <div className="vd-credit">
                        <span className="vd-credit__label">Publishers</span>
                        <span className="vd-credit__value">
                          {game.publishers.join(", ")}
                        </span>
                      </div>
                    )}
                    {game.esrb_rating && (
                      <div className="vd-credit">
                        <span className="vd-credit__label">ESRB</span>
                        <span className="vd-credit__value">{game.esrb_rating}</span>
                      </div>
                    )}
                  </section>
                )}

                {/* Platforms */}
                {game.platforms?.length > 0 && (
                  <section className="vd-section">
                    <h2 className="vd-section__title">Platforms</h2>
                    <div className="vd-platforms">
                      {game.platforms.map((platform, i) => (
                        <button
                          key={i}
                          className="vd-platform"
                          onClick={() => handlePlatformClick(platform)}
                        >
                          <FontAwesomeIcon
                            icon={platformIcons[platform] || platformIcons["Default"]}
                            className="vd-platform__icon"
                          />
                          <span className="vd-platform__name">{platform}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* Where to buy / Price comparison */}
                <PriceComparison gameId={id} gameName={game.name} />
              </motion.div>
            )}

            {activeTab === "media" && (
              <motion.div
                key="media"
                variants={tabContentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="vd-tab-content"
              >
                <div className="vd-media-toggle">
                  <button
                    className={`vd-media-btn ${mediaType === "screenshots" ? "vd-media-btn--active" : ""}`}
                    onClick={() => setMediaType("screenshots")}
                  >
                    Screenshots
                  </button>
                  <button
                    className={`vd-media-btn ${mediaType === "trailers" ? "vd-media-btn--active" : ""}`}
                    onClick={() => setMediaType("trailers")}
                  >
                    Trailers
                  </button>
                </div>
                <MediaGallery gameId={id} type={mediaType} />
              </motion.div>
            )}

            {activeTab === "similar" && (
              <motion.div
                key="similar"
                variants={tabContentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="vd-tab-content"
              >
                <SimilarGames games={sameGenreGames} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
}
