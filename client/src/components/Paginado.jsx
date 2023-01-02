import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { goToPage } from "../Redux/actions";

export default function Paginado() {
  const VIDEO_GAMES_PER_PAGE = 15;
  const dispatch = useDispatch();
  const numberOfPages = useSelector((state) => [
    ...Array(Math.ceil(state.videogames.length / VIDEO_GAMES_PER_PAGE)).keys(),
  ]);

  const handlePageSelection = (page) => {
    dispatch(goToPage(page));
    // Nos movemos al tope de la lista al cambiar de pagina.
    window.scrollTo({ top: 0, left: 0 });
  };

  return (
    <nav>
      <div className="div.center ">
        <div className="pagination">
          <ul className="ul.pagination li a.active">
            {numberOfPages &&
              numberOfPages.map((number) => (
                <li key={number} onClick={() => handlePageSelection(number)}>
                  {number + 1}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
