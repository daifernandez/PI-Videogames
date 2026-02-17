import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Styles/TopProgressBar.css";

/**
 * Barra de progreso tipo NProgress/YouTube en la parte superior.
 * Se muestra durante: carga de datos (Redux) y navegación entre rutas.
 */
export default function TopProgressBar() {
  const location = useLocation();
  const loading = useSelector((state) => state.loading);
  const [navigating, setNavigating] = useState(false);
  const [visible, setVisible] = useState(false);

  const isActive = loading || navigating;

  useEffect(() => {
    setNavigating(true);
    const timer = setTimeout(() => setNavigating(false), 350);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!visible) return null;

  return (
    <div
      className={`top-progress-bar ${isActive ? "top-progress-bar--active" : "top-progress-bar--finishing"}`}
      role="progressbar"
      aria-hidden="true"
    >
      <div className="top-progress-bar__indeterminate" />
    </div>
  );
}
