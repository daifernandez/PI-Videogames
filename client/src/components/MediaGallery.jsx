import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Lightbox from "./Lightbox";
import "./Styles/MediaGallery.css";

const apiUrl = process.env.REACT_APP_API_HOST;

export default function MediaGallery({ gameId, type }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchMedia = async () => {
      setLoading(true);
      setError(null);

      const cacheKey = `media-${gameId}-${type}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        if (!cancelled) {
          setMedia(parsed);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/videogame/${gameId}/${type}`);
        const items = response.data[type] || [];
        sessionStorage.setItem(cacheKey, JSON.stringify(items));
        if (!cancelled) {
          setMedia(items);
        }
      } catch (err) {
        console.error("Error loading media:", err);
        if (!cancelled) {
          setError("Could not load media content");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMedia();
    return () => { cancelled = true; };
  }, [gameId, type]);

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const navigateLightbox = useCallback((index) => {
    setLightboxIndex(index);
  }, []);

  if (loading) {
    return (
      <div className="mg-loading">
        <div className="mg-loading__grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mg-loading__item" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mg-empty">
        <span className="material-symbols-rounded mg-empty__icon">error_outline</span>
        <p className="mg-empty__text">{error}</p>
      </div>
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="mg-empty">
        <span className="material-symbols-rounded mg-empty__icon">
          {type === "screenshots" ? "photo_library" : "videocam_off"}
        </span>
        <p className="mg-empty__text">
          {type === "screenshots"
            ? "No screenshots available"
            : "No trailers available"}
        </p>
      </div>
    );
  }

  if (type === "screenshots") {
    return (
      <>
        <motion.div
          className="mg-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {media.map((src, i) => (
            <motion.div
              key={i}
              className="mg-screenshot"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
              onClick={() => openLightbox(i)}
              role="button"
              tabIndex={0}
              aria-label={`View screenshot ${i + 1}`}
              onKeyDown={(e) => e.key === "Enter" && openLightbox(i)}
            >
              <img
                src={src}
                alt={`Screenshot ${i + 1}`}
                loading="lazy"
                draggable={false}
              />
              <div className="mg-screenshot__overlay">
                <span className="material-symbols-rounded">zoom_in</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <Lightbox
          images={media}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      </>
    );
  }

  return (
    <motion.div
      className="mg-trailers"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {media.map((trailer, i) => (
        <motion.div
          key={i}
          className="mg-trailer"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="mg-trailer__video">
            {trailer.isYoutube ? (
              <iframe
                src={trailer.url}
                title={trailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                controls
                poster={trailer.thumbnail}
                preload="metadata"
                playsInline
              >
                <source src={trailer.url} type="video/mp4" />
                <source src={trailer.url} type="video/webm" />
              </video>
            )}
          </div>
          {trailer.name && (
            <p className="mg-trailer__title">{trailer.name}</p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
