import React, { useState } from "react";
import "./Styles/ImagePlaceholder.css";

/**
 * Imagen con placeholder mientras carga y fallback si falla.
 * - Mientras carga: shimmer
 * - Si falla: placeholder con nombre
 * - Fade al cargar
 */
export default function ImagePlaceholder({
  src,
  alt = "",
  className = "",
  name,
  loading = "lazy",
  ...props
}) {
  const [status, setStatus] = useState(src ? "loading" : "error");
  const displayName = name || alt;

  const handleLoad = () => setStatus("loaded");
  const handleError = () => setStatus("error");

  return (
    <div
      className={`img-placeholder img-placeholder--${status} ${className}`}
      {...props}
    >
      {status === "error" ? (
        <div className="img-placeholder__fallback">
          <span className="material-symbols-rounded img-placeholder__icon">
            sports_esports
          </span>
          {displayName && (
            <span className="img-placeholder__name">{displayName}</span>
          )}
        </div>
      ) : (
        <>
          {src && (
            <img
              src={src}
              alt={alt}
              loading={loading}
              onLoad={handleLoad}
              onError={handleError}
              className="img-placeholder__img"
            />
          )}
          {(status === "loading" || !src) && (
            <div className="img-placeholder__shimmer" />
          )}
        </>
      )}
    </div>
  );
}
