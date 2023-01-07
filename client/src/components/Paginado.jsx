import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { goToPage } from "../Redux/actions";
import "./Styles/Paginado.css";

export default function Paginado() {
  const VIDEO_GAMES_PER_PAGE = 15;
  const dispatch = useDispatch();
  const videogames = useSelector((state) =>
    state.videogamesForFilter !== null
      ? state.videogamesForFilter
      : state.videogames
  );
  const numberOfPages = useSelector((state) => [
    ...Array(Math.ceil(videogames.length / VIDEO_GAMES_PER_PAGE)).keys(),
  ]);
  const currentPage = useSelector((state) => state.currentPage);

  const handlePageSelection = (page) => {
    dispatch(goToPage(page));
    // Nos movemos al tope de la lista al cambiar de pagina.
    window.scrollTo({ top: 0, left: 0 });
  };

  return (
    <nav>
      <div className="pagination">
        <div>
          {numberOfPages &&
            numberOfPages.map((number) => (
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
