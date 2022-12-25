import { GET_GENRES, GET_VIDEOGAMES, SELECT_GENRE } from "./actions";

const initialState = {
  videogames: [],
  genres: [],
  videogamesOnScreen: [],
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
    case SELECT_GENRE:
      const filterGenre = [...state.videogames].filter((videogame) =>
        videogame.genres.includes(action.payload)
      );
      return {
        ...state,
        videogamesOnScreen: filterGenre,
      };
    default:
      return { ...state };
  }
}

export default rootReducer;
