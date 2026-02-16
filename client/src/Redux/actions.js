import axios from "axios";

const apiUrl = process.env.REACT_APP_API_HOST;

// Action type constants
export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const LOADING_VIDEOGAMES = "LOADING_VIDEOGAMES";
export const FINISH_LOADING_VIDEOGAMES = "FINISH_LOADING_VIDEOGAMES";
export const ERROR_VIDEOGAMES = "ERROR_VIDEOGAMES";
export const GET_GENRES = "GET_GENRES";
export const GET_VIDEOGAME_BY_NAME = "GET_VIDEOGAME_BY_NAME";
export const ERROR_VIDEOGAME_BY_NAME = "ERROR_VIDEOGAME_BY_NAME";
export const SELECT_GENRE = "SELECT_GENRE";
export const SELECT_PLATFORM = "SELECT_PLATFORM";
export const ALPH_ORDER = "ALPH_ORDER";
export const RATING_ORDER = "RATING_ORDER";
export const CLEAR = "CLEAR";
export const GO_TO_PAGE = "GO_TO_PAGE";
export const GET_UPCOMING_GAMES = "GET_UPCOMING_GAMES";
export const LOADING_UPCOMING_GAMES = "LOADING_UPCOMING_GAMES";
export const FINISH_LOADING_UPCOMING_GAMES = "FINISH_LOADING_UPCOMING_GAMES";
export const ERROR_UPCOMING_GAMES = "ERROR_UPCOMING_GAMES";
export const GET_RECENT_GAMES = "GET_RECENT_GAMES";
export const LOADING_RECENT_GAMES = "LOADING_RECENT_GAMES";
export const FINISH_LOADING_RECENT_GAMES = "FINISH_LOADING_RECENT_GAMES";
export const ERROR_RECENT_GAMES = "ERROR_RECENT_GAMES";
export const SET_STATE_FROM_URL = "SET_STATE_FROM_URL";

export function getvideogames() {
  return async function (dispatch) {
    try {
      dispatch({ type: LOADING_VIDEOGAMES });
      const response = await axios.get(`${apiUrl}/videogames`);
      
      if (!response.data || response.data.length === 0) {
        throw new Error("No se encontraron videojuegos disponibles");
      }
      
      dispatch({ type: GET_VIDEOGAMES, payload: response.data });
    } catch (error) {
      console.error("Error al obtener videojuegos:", {
        mensaje: error.message,
        código: error.code,
        detalles: error.response?.data || 'Sin detalles adicionales'
      });

      let errorMessage = "Error al cargar los videojuegos";

      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "No se encontraron videojuegos";
            break;
          case 500:
            errorMessage = "Error en el servidor. Por favor, inténtalo más tarde";
            break;
          case 503:
            errorMessage = "Servicio temporalmente no disponible";
            break;
          default:
            errorMessage = error.response.data?.error || errorMessage;
        }
      }

      dispatch({ 
        type: ERROR_VIDEOGAMES, 
        payload: errorMessage
      });
    } finally {
      dispatch({ type: FINISH_LOADING_VIDEOGAMES });
    }
  };
}

export const getgenres = () => {
  return async function (dispatch) {
    try {
      // Verificar si tenemos los géneros en caché
      const cachedGenres = sessionStorage.getItem('genres');
      if (cachedGenres) {
        return dispatch({
          type: GET_GENRES,
          payload: JSON.parse(cachedGenres),
        });
      }

      const response = await axios.get(`${apiUrl}/genres`);
      
      // Guardar en caché
      sessionStorage.setItem('genres', JSON.stringify(response.data));
      
      return dispatch({
        type: GET_GENRES,
        payload: response.data,
      });
    } catch (error) {
      console.error("Error al obtener géneros:", error);
    }
  };
};

export function getVideogameByName(name) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${apiUrl}/videogames?name=${encodeURIComponent(name)}`);
      if (!response.data || response.data.length === 0) {
        dispatch({
          type: ERROR_VIDEOGAME_BY_NAME,
          payload: {
            error: "No se encontraron videojuegos con ese nombre",
            searchQuery: name,
          },
        });
        return;
      }
      dispatch({ type: GET_VIDEOGAME_BY_NAME, payload: { data: response.data, searchQuery: name } });
    } catch (error) {
      console.error("Error en get videogame by name:", {
        mensaje: error.message,
        código: error.code,
        detalles: error.response?.data || "Sin detalles adicionales",
      });
      let errorMessage = "Error al buscar. Inténtalo de nuevo.";
      if (error.response?.status === 404) {
        errorMessage = "No se encontraron videojuegos con ese nombre";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      dispatch({ type: ERROR_VIDEOGAME_BY_NAME, payload: { error: errorMessage, searchQuery: name } });
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

/** Aplica filtros, orden y página desde la URL (para sincronización bidireccional) */
export function setStateFromUrl(params) {
  return function (dispatch) {
    dispatch({ type: SET_STATE_FROM_URL, payload: params });
  };
}

export function getUpcomingGames() {
  return async function (dispatch) {
    try {
      dispatch({ type: LOADING_UPCOMING_GAMES });
      const response = await axios.get(`${apiUrl}/videogames/upcoming`);
      
      if (!response.data || response.data.length === 0) {
        throw new Error("No se encontraron próximos lanzamientos");
      }
      
      dispatch({ type: GET_UPCOMING_GAMES, payload: response.data });
    } catch (error) {
      console.error("Error al obtener próximos lanzamientos:", {
        mensaje: error.message,
        código: error.code,
        detalles: error.response?.data || 'Sin detalles adicionales'
      });

      dispatch({ 
        type: ERROR_UPCOMING_GAMES, 
        payload: error.response?.data?.error || "Error al cargar los próximos lanzamientos"
      });
    } finally {
      dispatch({ type: FINISH_LOADING_UPCOMING_GAMES });
    }
  };
}

export function getRecentGames() {
  return async function (dispatch) {
    try {
      dispatch({ type: LOADING_RECENT_GAMES });
      const response = await axios.get(`${apiUrl}/videogames/recent`);
      
      if (!response.data || response.data.length === 0) {
        throw new Error("No se encontraron lanzamientos recientes");
      }
      
      dispatch({ type: GET_RECENT_GAMES, payload: response.data });
    } catch (error) {
      console.error("Error al obtener lanzamientos recientes:", {
        mensaje: error.message,
        código: error.code,
        detalles: error.response?.data || 'Sin detalles adicionales'
      });

      dispatch({ 
        type: ERROR_RECENT_GAMES, 
        payload: error.response?.data?.error || "Error al cargar los lanzamientos recientes"
      });
    } finally {
      dispatch({ type: FINISH_LOADING_RECENT_GAMES });
    }
  };
}
