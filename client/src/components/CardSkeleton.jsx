import React from "react";
import "./Styles/CardSkeleton.css";

export default function CardSkeleton({ count = 12 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card-skeleton" aria-hidden="true">
          <div className="skeleton-shimmer" />
          <div className="skeleton-content">
            <div className="skeleton-header">
              <div className="skeleton-badge" />
              <div className="skeleton-rating" />
            </div>
            <div className="skeleton-body">
              <div className="skeleton-title" />
              <div className="skeleton-meta">
                <div className="skeleton-tag" />
                <div className="skeleton-tag skeleton-tag-short" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
