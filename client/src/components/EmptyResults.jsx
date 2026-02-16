import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clear } from "../Redux/actions";
import "./Styles/EmptyResults.css";

function EmptyIllustration() {
  return (
    <svg
      className="empty-illustration"
      width="160"
      height="140"
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="80" cy="126" rx="56" ry="8" fill="var(--accent-soft)" />
      <rect x="38" y="30" width="84" height="84" rx="16" fill="var(--bg-elevated)" stroke="var(--border-primary)" strokeWidth="2" />
      <circle cx="66" cy="68" r="20" stroke="var(--accent)" strokeWidth="2.5" fill="none" />
      <line x1="80.5" y1="83" x2="96" y2="98.5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="68" x2="72" y2="68" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" />
      <path d="M104 50 L110 56 M110 50 L104 56" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="35" cy="45" r="3" fill="var(--accent-soft)" />
      <circle cx="128" cy="72" r="4" fill="var(--accent-soft)" />
      <circle cx="115" cy="38" r="2.5" fill="var(--accent-border)" />
    </svg>
  );
}

function ErrorIllustration() {
  return (
    <svg
      className="empty-illustration"
      width="160"
      height="140"
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="80" cy="126" rx="56" ry="8" fill="var(--accent-soft)" />
      <rect x="38" y="30" width="84" height="84" rx="16" fill="var(--bg-elevated)" stroke="var(--border-primary)" strokeWidth="2" />
      <circle cx="80" cy="62" r="4" fill="#f87171" />
      <rect x="78" y="72" width="4" height="20" rx="2" fill="#f87171" />
      <path d="M55 100 L80 55 L105 100 Z" stroke="#f87171" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <circle cx="35" cy="45" r="3" fill="var(--accent-soft)" />
      <circle cx="128" cy="72" r="4" fill="var(--accent-soft)" />
    </svg>
  );
}

export default function EmptyResults({ isHome, message, suggestion, isError = false, onRetry }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleClear(e) {
    e.preventDefault();
    if (isHome) {
      dispatch(clear());
    } else {
      navigate(-1);
    }
  }

  return (
    <div className="empty-results-container" role="status">
      {isError ? <ErrorIllustration /> : <EmptyIllustration />}

      <p className="empty-message">
        {message || "Sorry! We couldn't find any games"}
      </p>

      {suggestion && (
        <p className="empty-suggestion">{suggestion}</p>
      )}

      <div className="empty-actions">
        {isError && onRetry && (
          <button
            className="empty-btn empty-btn--primary"
            onClick={onRetry}
            aria-label="Retry loading"
          >
            <span className="material-symbols-rounded" aria-hidden="true">refresh</span>
            Retry
          </button>
        )}
        <button
          className="empty-btn empty-btn--secondary"
          onClick={handleClear}
          aria-label={isHome ? "Clear all filters" : "Go back to previous page"}
        >
          <span className="material-symbols-rounded" aria-hidden="true">
            {isHome ? "filter_list_off" : "arrow_back"}
          </span>
          {isHome ? "Clear Filters" : "Go Back"}
        </button>
      </div>
    </div>
  );
}
