import axios from "axios";

export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const GET_GENRES = "GET_GENRES";
export const GET_VIDEOGAME_BY_NAME = "GET_VIDEOGAME_BY_NAME";
export const POST_VIDEOGAME = "POST_VIDEOGAME";
export const SELECT_GENRE = "SELECT_GENRE";
export const GET_CREATED = "GET_CREATED";
export const ALPH_ORDER = "ALPH_ORDER";
export const RATING_ORDER = "RATING_ORDER";
export const CLEAR = "CLEAR";
export const GO_TO_PAGE = "GO_TO_PAGE";
export const DELETE_DB_VIDEOGAME = "DELETE_DB_VIDEOGAME";

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

//CREO QUE NO VA ACA, REVISAR, NO HAY UNA FUNCION DISPACHADORA PARA EL REDUCER
export async function getVideogameDetail(id) {
  const response = await axios.get(`http://localhost:3001/videogame/${id}`);
  return response.data;
}

export function getVideogameByName(name) {
  return async function (dispatch) {
    await axios
      .get(`http://localhost:3001/videogames?name=${name}`)
      .then((response) =>
        dispatch({ type: GET_VIDEOGAME_BY_NAME, payload: response.data })
      );
  };
}

export function postVideogame(videogame, callback) {
  return async function (dispatch) {
    await axios
      .post("http://localhost:3001/videogames", videogame)
      .then((response) => {
        dispatch({ type: POST_VIDEOGAME, payload: response.data });
        callback(response.data);
      });
  };
}

export function selectGenre(genre) {
  return function (dispatch) {
    dispatch({ type: SELECT_GENRE, payload: genre });
  };
}

export function getCreated(order) {
  return function (dispatch) {
    dispatch({ type: GET_CREATED, payload: order });
  };
}

export function alphOrder(order) {
  return function (dispatch) {
    dispatch({ type: ALPH_ORDER, payload: order });
  };
}

export function ratingOrder(order) {
  return function (dispatch) {
    dispatch({ type: RATING_ORDER, payload: order });
  };
}

export function clear() {
  return function (dispatch) {
    dispatch({ type: CLEAR });
  };
}

export function goToPage(page) {
  return function (dispatch) {
    dispatch({ type: GO_TO_PAGE, payload: page });
  };
}

export function deleteVideogameDB(id) {
  return async function (dispatch) {
    await axios
      .delete(`http://localhost:3001/videogame/${id}`)
      .then(function (response) {
        dispatch({ type: DELETE_DB_VIDEOGAME, payload: response.data });
      });
  };
}
