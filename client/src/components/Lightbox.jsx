import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Styles/Lightbox.css";

export default function Lightbox({ images = [], currentIndex = 0, isOpen, onClose, onNavigate }) {
  const total = images.length;
  const hasNext = currentIndex < total - 1;
  const hasPrev = currentIndex > 0;

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen || !images.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <div className="lightbox__header">
          <span className="lightbox__counter">
            {currentIndex + 1} / {total}
          </span>
          <button
            className="lightbox__close"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <div className="lightbox__body" onClick={(e) => e.stopPropagation()}>
          {hasPrev && (
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </button>
          )}

          <motion.div
            className="lightbox__image-wrapper"
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={images[currentIndex]}
              alt={`Screenshot ${currentIndex + 1}`}
              className="lightbox__image"
              draggable={false}
            />
          </motion.div>

          {hasNext && (
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={goNext}
              aria-label="Next image"
            >
              <span className="material-symbols-rounded">chevron_right</span>
            </button>
          )}
        </div>

        <div className="lightbox__thumbnails">
          {images.map((img, i) => (
            <button
              key={i}
              className={`lightbox__thumb ${i === currentIndex ? "lightbox__thumb--active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(i);
              }}
              aria-label={`Go to image ${i + 1}`}
            >
              <img src={img} alt="" draggable={false} />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
