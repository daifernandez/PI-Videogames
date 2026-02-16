import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Styles/RatingCircle.css";

const SIZE = 72;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getRatingColor(rating) {
  if (rating >= 4) return "#4ade80";
  if (rating >= 3) return "#facc15";
  return "#f87171";
}

function getRatingLabel(rating) {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4) return "Great";
  if (rating >= 3) return "Good";
  if (rating >= 2) return "Average";
  return "Poor";
}

export default function RatingCircle({ rating = 0, size = "default" }) {
  const [mounted, setMounted] = useState(false);
  const numRating = parseFloat(rating) || 0;
  const progress = numRating / 5;
  const offset = CIRCUMFERENCE * (1 - progress);
  const color = getRatingColor(numRating);
  const label = getRatingLabel(numRating);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`rating-circle ${size}`}
      title={`${numRating.toFixed(1)} / 5 — ${label}`}
    >
      <svg
        className="rating-circle__svg"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <circle
          className="rating-circle__track"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
        />
        <motion.circle
          className="rating-circle__progress"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          stroke={color}
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: mounted ? offset : CIRCUMFERENCE }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <div className="rating-circle__value">
        <span className="rating-circle__number" style={{ color }}>
          {numRating.toFixed(1)}
        </span>
      </div>
      <span className="rating-circle__label">{label}</span>
    </div>
  );
}
