import React, { useState, useRef, useEffect } from 'react';
import './Styles/Tooltip.css';

export default function Tooltip({ children, text, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tipRef = useRef(null);

  useEffect(() => {
    if (!visible || !triggerRef.current || !tipRef.current) return;

    const tr = triggerRef.current.getBoundingClientRect();
    const tp = tipRef.current.getBoundingClientRect();
    const gap = 8;

    let top, left;

    switch (position) {
      case 'bottom':
        top = tr.bottom + gap;
        left = tr.left + tr.width / 2 - tp.width / 2;
        break;
      case 'left':
        top = tr.top + tr.height / 2 - tp.height / 2;
        left = tr.left - tp.width - gap;
        break;
      case 'right':
        top = tr.top + tr.height / 2 - tp.height / 2;
        left = tr.right + gap;
        break;
      default: // top
        top = tr.top - tp.height - gap;
        left = tr.left + tr.width / 2 - tp.width / 2;
    }

    left = Math.max(8, Math.min(left, window.innerWidth - tp.width - 8));
    top = Math.max(8, top);

    setCoords({ top, left });
  }, [visible, position]);

  return (
    <span
      className="tooltip-trigger"
      ref={triggerRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className={`tooltip-bubble tooltip-${position}`}
          ref={tipRef}
          role="tooltip"
          style={{ top: coords.top, left: coords.left }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
