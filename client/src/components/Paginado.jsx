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
          <button
            className="pagination-NextPrevious"
            onClick={() => handlePageSelection(currentPage - 1)}
            hidden={currentPage === 0}
          >
            <span className="material-symbols-rounded extra-left-padding">
              arrow_back_ios
            </span>
          </button>
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
          <button
            className="pagination-NextPrevious"
            onClick={() => handlePageSelection(currentPage + 1)}
            hidden={currentPage === arrayOfPages.length - 1}
          >
            <span className="material-symbols-rounded">arrow_forward_ios</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
