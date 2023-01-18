import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { goToPage } from "../Redux/actions";
import "./Styles/Paginado.css";

export default function Paginado() {
  const dispatch = useDispatch();
  const arrayOfPages = useSelector((state) => {
    var pages = [];
    for (var i = 0; i < state.numberOfPages; i++) {
      pages.push(i);
    }
    return pages;
  });
  const currentPage = useSelector((state) => state.currentPage);

  const handlePageSelection = (page) => {
    dispatch(goToPage(page));
    window.scrollTo({ top: 0, left: 0 });
  };

  return (
    <nav>
      <div className="pagination">
        <div>
          {arrayOfPages &&
            arrayOfPages.map((number) => (
              <button
                className={
                  currentPage === number
                    ? "pagination-button-current"
                    : "pagination-button"
                }
                key={number}
                onClick={() => handlePageSelection(number)}
              >
                {number + 1}
              </button>
            ))}
        </div>
      </div>
    </nav>
  );
}
