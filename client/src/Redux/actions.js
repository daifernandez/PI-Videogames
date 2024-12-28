import axios from "axios";
// TODO: Arreglar el error de dotenv
// require("dotenv").config();
// const { REACT_APP_API_HOST } = process.env;

const REACT_APP_API_HOST = "http://localhost:3001";

export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const GET_GENRES = "GET_GENRES";
export const GET_VIDEOGAME_BY_NAME = "GET_VIDEOGAME_BY_NAME";
export const POST_VIDEOGAME = "POST_VIDEOGAME";
export const SELECT_GENRE = "SELECT_GENRE";
export const SELECT_PLATFORM = "SELECT_PLATFORM";
export const GET_CREATED = "GET_CREATED";
export const ALPH_ORDER = "ALPH_ORDER";
export const RATING_ORDER = "RATING_ORDER";
export const CLEAR = "CLEAR";
export const GO_TO_PAGE = "GO_TO_PAGE";
export const DELETE_DB_VIDEOGAME = "DELETE_DB_VIDEOGAME";

export function getvideogames() {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${REACT_APP_API_HOST}/videogames`);
      dispatch({ type: GET_VIDEOGAMES, payload: response.data });
    } catch (error) {
      console.error("Error en get videogames:", {
        mensaje: error.message,
        código: error.code,
        detalles: error.response?.data || 'Sin detalles adicionales'
      });
      // Opcionalmente despachar una acción de error
      dispatch({ 
        type: "ERROR", 
        payload: "No se pudieron cargar los videojuegos. Por favor, verifica tu conexión."
      });
    }
  };
}

export function getGenres() {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${REACT_APP_API_HOST}/genres`);
      dispatch({ type: GET_GENRES, payload: response.data });
    } catch (error) {
      console.error("Error en get genres:", {
        mensaje: error.message,
        código: error.code,
        detalles: error.response?.data || 'Sin detalles adicionales'
      });
    }
  };
}

export function getVideogameByName(name) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${REACT_APP_API_HOST}/videogames?name=${name}`);
      dispatch({ type: GET_VIDEOGAME_BY_NAME, payload: response.data });
    } catch (error) {
      console.error("Error en get videogame by name:", {
        mensaje: error.message,
        código: error.code,
        detalles: error.response?.data || 'Sin detalles adicionales'
      });
    }
  };
}

export function postVideogame(videogame, callback) {
  return async function (dispatch) {
    try {
      const response = await axios.post(`${REACT_APP_API_HOST}/videogames`, videogame);
      dispatch({ type: POST_VIDEOGAME, payload: response.data });
      callback(response.data);
    } catch (error) {
      console.error("Error en post videogame:", {
        mensaje: error.message,
        código: error.code,
        detalles: error.response?.data || 'Sin detalles adicionales'
      });
    }
  };    
}

export function selectGenre(genre) {
  return function (dispatch) {
    dispatch({ type: SELECT_GENRE, payload: genre });
  };
}

export function selectPlatform(platform) {
  return function (dispatch) {
    dispatch({ type: SELECT_PLATFORM, payload: platform });
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
    try {
      const response = await axios.delete(`${REACT_APP_API_HOST}/videogame/${id}`);
      dispatch({ type: DELETE_DB_VIDEOGAME, payload: response.data });
    } catch (error) {
      console.error("Error en delete videogame db:", {
        mensaje: error.message,
        código: error.code,
        detalles: error.response?.data || 'Sin detalles adicionales'
      });
    }
  };   
}
