import axios from "axios";

export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const GET_GENRES = "GET_GENRES";
export const SELECT_GENRE = "SELECT_GENRE";

export function getvideogames() {
  return async function (dispatch) {
    await axios
      .get("http://localhost:3001/videogames")
      .then((response) =>
        dispatch({ type: GET_VIDEOGAMES, payload: response.data })
      );
  };
}

export function getGenres() {
  return async function (dispatch) {
    await axios
      .get("http://localhost:3001/genres")
      .then((response) =>
        dispatch({ type: GET_GENRES, payload: response.data })
      );
  };
}

export function selectGenre(genre) {
  return function (dispatch) {
    dispatch({ type: SELECT_GENRE, payload: genre });
  };
}
