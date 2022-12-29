import {
  ALPH_ORDER,
  GET_GENRES,
  GET_VIDEOGAMES,
  GET_VIDEOGAME_DETAIL,
  SELECT_GENRE,
  RATING_ORDER,
  GET_CREATED,
  GET_VIDEOGAME_BY_NAME,
  CLEAR,
  POST_VIDEOGAME,
} from "./actions";

const initialState = {
  videogames: [],
  genres: [],
  videogamesOnScreen: [],
  videogameDetail: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VIDEOGAMES:
      return {
        ...state,
        videogames: action.payload,
        videogamesOnScreen: action.payload,
      };
    case GET_GENRES:
      return {
        ...state,
        genres: action.payload,
      };
    case GET_VIDEOGAME_BY_NAME:
      return {
        ...state,
        videogamesOnScreen: action.payload,
      };
    case GET_VIDEOGAME_DETAIL:
      return {
        ...state,
        videogameDetail: action.payload,
      };
    case SELECT_GENRE:
      var filterGenre = [...state.videogames].filter((videogame) =>
        videogame.genres.includes(action.payload)
      );
      if (action.payload === "-") {
        filterGenre = [...state.videogames];
      }
      return {
        ...state,
        videogamesOnScreen: filterGenre,
      };
    case POST_VIDEOGAME:
      return {
        ...state,
      };
    case GET_CREATED:
      console.log(action.payload);
      const createdFilter =
        action.payload === "createdInDB"
          ? state.videogames.filter((e) => e.createdInDB)
          : state.videogames.filter((e) => !e.createdInDB);
      return {
        ...state,
        videogamesOnScreen:
          action.payload === "allVideogames" ? state.videogames : createdFilter,
      };

    case ALPH_ORDER:
      var alphSorted = [...state.videogames].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (action.payload === "DESC") {
        alphSorted = alphSorted.reverse();
      }
      if (action.payload === "-") {
        alphSorted = [...state.videogames];
      }

      return {
        ...state,
        videogamesOnScreen: alphSorted,
      };
    case RATING_ORDER:
      var hsSorted = [...state.videogames].sort(function (a, b) {
        return a.rating - b.rating;
      });
      if (action.payload === "Higher") {
        hsSorted = hsSorted.reverse();
      }
      if (action.payload === "-") {
        hsSorted = [...state.videogames];
      }
      return {
        ...state,
        videogamesOnScreen: hsSorted,
      };
    case CLEAR:
      return {
        ...state,
        videogamesOnScreen: [...state.videogames],
      };
    default:
      return { ...state };
  }
}

export default rootReducer;
