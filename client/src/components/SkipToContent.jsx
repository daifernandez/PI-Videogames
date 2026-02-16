import React from 'react';
import './Styles/SkipToContent.css';

export default function SkipToContent({ target = '#main-content' }) {
  const handleClick = (e) => {
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) {
      el.focus({ preventScroll: false });
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a href={target} className="skip-to-content" onClick={handleClick}>
      Skip to content
    </a>
  );
}
