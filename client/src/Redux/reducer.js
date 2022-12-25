import { GET_GENRES, GET_VIDEOGAMES } from "./actions";

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

    default:
      return { ...state };
  }
}

export default rootReducer;
