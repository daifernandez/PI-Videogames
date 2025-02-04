import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon, InformationCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import "./Styles/Landing.css";
import "./Styles/Button.css";
import Logo from "../img/landing.png";
import title from "../img/title.png";
import Footer from "./Footer";

const Feature = ({ icon: Icon, title, description }) => (
  <div className="feature-item">
    <div className="feature-icon">
      <Icon className="feature-svg" aria-hidden="true" />
    </div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

const StatsCounter = ({ end, duration = 2000, label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <div className="stat-item">
      <div className="stat-number">{count}+</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default function Landing() {
  useEffect(() => {
    document.title = "GameStream - Your Gaming Portal";
  }, []);

  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: "Search & Filter",
      description: "Search for games and filter them by name, genre, rating, and source"
    },
    {
      icon: InformationCircleIcon,
      title: "Game Details",
      description: "View detailed information about each game including description, rating, and platforms"
    },
    {
      icon: PlusCircleIcon,
      title: "Create Games",
      description: "Add your own games to the database with custom details and information"
    }
  ];

  return (
    <main className="landing-container">
      <div className="landing">
        <div className="contenedor-titulo animate-fade-in">
          <h1 className="welcome-text">Welcome to</h1>
          <img className="title animate-slide-down" src={title} alt="GameStream Logo" />
          <h2 className="landing-description animate-fade-in">
            Your Ultimate Gaming Portal
          </h2>
          <p className="landing-description animate-fade-in">
            Discover a massive library of games, explore new titles,
            filter by your favorite genres and join our community.
          </p>
          
          <div className="stats-container animate-fade-in">
            <StatsCounter end={1000} label="Available Games" />
            <StatsCounter end={50} label="Genres" />
            <StatsCounter end={100} label="New Releases" />
          </div>

          <div className="cta-container">
            <Link to="/home" className="cta-link">
              <button className="cta-button">
                Start Exploring
                <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
            <p className="cta-description">Instant Access - No Registration Required</p>
          </div>
        </div>
        <img 
          id="logo" 
          src={Logo} 
          className="logo animate-float" 
          alt="Gaming illustration" 
        />
      </div>

      <section className="features-section">
        <h2 className="features-title">Why Choose Us</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
