import React, { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useInView from "../hooks/useInView";
import "./Styles/Landing.css";
import Footer from "./Footer";
import heroImg from "../img/landing.png";

function Counter({ end, suffix = "+", label, active }) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let start = null;
    let raf;
    const dur = 1800;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Math.floor(end * ease(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, active]);
  return (
    <div className="ln-stat">
      <span className="ln-stat-num">
        {val}
        {suffix}
      </span>
      <span className="ln-stat-lbl">{label}</span>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView({ threshold: 0.15 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const features = [
  {
    icon: "search",
    title: "Search & Filter",
    desc: "Find any game by name, genre, rating or source with smart autocomplete.",
    gradient: "ln-grad-blue",
  },
  {
    icon: "info",
    title: "Detailed Info",
    desc: "Explore screenshots, trailers, ratings and discover similar titles.",
    gradient: "ln-grad-purple",
  },
  {
    icon: "add_circle",
    title: "Create Games",
    desc: "Add your own games to the catalog with custom details and media.",
    gradient: "ln-grad-pink",
  },
];

function FloatingOrb({ className }) {
  return <div className={`ln-orb ${className}`} aria-hidden="true" />;
}

function ScrollIndicator() {
  const handleClick = useCallback(() => {
    const statsSection = document.querySelector(".ln-section");
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <motion.button
      className="ln-scroll-indicator"
      onClick={handleClick}
      aria-label="Scroll down"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 5V19M12 19L6 13M12 19L18 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

export default function Landing() {
  useEffect(() => {
    document.title = "GameStream — Your Gaming Portal";
  }, []);

  const [statsRef, statsActive] = useInView({ threshold: 0.3 });

  return (
    <main className="ln">
      {/* ─── Hero ─── */}
      <section className="ln-hero">
        <div className="ln-hero-bg" aria-hidden="true">
          <FloatingOrb className="ln-orb--1" />
          <FloatingOrb className="ln-orb--2" />
          <FloatingOrb className="ln-orb--3" />
          <div className="ln-hero-grid" />
        </div>

        <div className="ln-hero-row">
          <div className="ln-hero-content">
            <motion.h1
              className="brand-name ln-title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              GameStream
            </motion.h1>

            <motion.p
              className="ln-subtitle"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Discover, explore, and create.
              <br />
              Your ultimate gaming catalog.
            </motion.p>

            <motion.div
              className="ln-hero-actions"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <Link to="/home" className="ln-btn ln-btn--primary">
                Start Exploring
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link to="/createVideogame" className="ln-btn ln-btn--ghost">
                <span className="material-symbols-rounded" aria-hidden="true">
                  add_circle
                </span>
                Create Game
              </Link>
            </motion.div>

            <motion.span
              className="ln-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              No registration required
            </motion.span>
          </div>

          <motion.div
            className="ln-hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="ln-hero-glow" aria-hidden="true" />
            <div className="ln-hero-img-wrap">
              <img src={heroImg} alt="" className="ln-hero-img" />
            </div>
          </motion.div>
        </div>

        <ScrollIndicator />
      </section>

      {/* ─── Stats ─── */}
      <section
        className="ln-section ln-section--stats"
        ref={statsRef}
        aria-label="Platform statistics"
      >
        <FadeIn>
          <div className="ln-stats-card">
            <div className="ln-stats-card-glow" aria-hidden="true" />
            <Counter end={500} label="Games" active={statsActive} />
            <span className="ln-stats-sep" aria-hidden="true" />
            <Counter end={19} label="Genres" suffix="" active={statsActive} />
            <span className="ln-stats-sep" aria-hidden="true" />
            <Counter end={25} label="Platforms" active={statsActive} />
          </div>
        </FadeIn>
      </section>

      {/* ─── Features ─── */}
      <section
        className="ln-section ln-section--features"
        aria-labelledby="feat-h"
      >
        <FadeIn>
          <span className="ln-section-tag">Features</span>
          <h2 className="ln-heading" id="feat-h">
            Everything you need
          </h2>
          <p className="ln-heading-sub">
            Powerful tools to explore the world of gaming.
          </p>
        </FadeIn>
        <div className="ln-features">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.12} className="ln-feat-col">
              <div className="ln-feat">
                <div className={`ln-feat-icon ${f.gradient}`}>
                  <span className="material-symbols-rounded">{f.icon}</span>
                </div>
                <h3 className="ln-feat-title">{f.title}</h3>
                <p className="ln-feat-desc">{f.desc}</p>
                <div className="ln-feat-shine" aria-hidden="true" />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="ln-cta">
        <div className="ln-cta-bg" aria-hidden="true">
          <div className="ln-cta-orb ln-cta-orb--1" />
          <div className="ln-cta-orb ln-cta-orb--2" />
        </div>
        <FadeIn>
          <span className="ln-section-tag ln-section-tag--light">
            Get Started
          </span>
          <h2 className="ln-cta-title">Ready to play?</h2>
          <p className="ln-cta-desc">
            Browse 500+ games, filter by genre and platform,
            <br />
            or create your own catalog entries.
          </p>
          <div className="ln-cta-actions">
            <Link to="/home" className="ln-btn ln-btn--primary ln-btn--lg">
              Explore Games
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12H19M19 12L13 6M19 12L13 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </main>
  );
}
