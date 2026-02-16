import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Breadcrumbs.css";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <Link to="/home" className="breadcrumbs__link">
            <span className="material-symbols-rounded breadcrumbs__icon">home</span>
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="breadcrumbs__item">
            <span className="breadcrumbs__separator">/</span>
            {item.to ? (
              <Link to={item.to} className="breadcrumbs__link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumbs__current" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
