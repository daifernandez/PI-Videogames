import {
  ALPH_ORDER,
  GET_GENRES,
  GET_VIDEOGAMES,
  SELECT_GENRE,
  RATING_ORDER,
  GET_CREATED,
  GET_VIDEOGAME_BY_NAME,
  CLEAR,
  POST_VIDEOGAME,
  GO_TO_PAGE,
  DELETE_DB_VIDEOGAME,
} from "./actions";

const VIDEO_GAMES_PER_PAGE = 15;

const initialState = {
  videogames: [],
  genres: [],
  videogamesOnScreen: [],
  currentPage: 0,
  videogamesForFilter: null,
  platforms: [],
};

function rootReducer(state = initialState, action) {
  const activeVideogames =
    state.videogamesForFilter !== null
      ? state.videogamesForFilter
      : state.videogames;

  switch (action.type) {
    case GET_VIDEOGAMES:
      const platforms = action.payload.map((el) => el.platforms).flat();
      const uniquePlatforms = new Set(platforms);
      return {
        ...state,
        videogames: action.payload,
        videogamesOnScreen: action.payload.slice(0, VIDEO_GAMES_PER_PAGE),
        currentPage: 0,
        platforms: Array.from(uniquePlatforms),
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
    case DELETE_DB_VIDEOGAME:
      return {
        ...state,
        videogameDetail: null,
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
        videogamesOnScreen: filterGenre.slice(0, VIDEO_GAMES_PER_PAGE),
        videogamesForFilter: filterGenre,
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
      var alphSorted = [...activeVideogames].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (action.payload === "DESC") {
        alphSorted = alphSorted.reverse();
      }
      if (action.payload === "-") {
        alphSorted = [...activeVideogames];
      }

      return {
        ...state,
        videogamesOnScreen: alphSorted,
      };
    case RATING_ORDER:
      var hsSorted = [...activeVideogames].sort(function (a, b) {
        return a.rating - b.rating;
      });
      if (action.payload === "Higher") {
        hsSorted = hsSorted.reverse();
      }
      if (action.payload === "-") {
        hsSorted = [...activeVideogames];
      }
      return {
        ...state,
        videogamesOnScreen: hsSorted.slice(0, VIDEO_GAMES_PER_PAGE),
      };
    case CLEAR:
      return {
        ...state,
        videogamesOnScreen: state.videogames.slice(0, VIDEO_GAMES_PER_PAGE),
        videogamesForFilter: null,
        currentPage: 0,
      };
    case GO_TO_PAGE:
      // Pagina que quiero mostrar
      const page = action.payload;
      // Indice del primer video game de esta pagina
      const indexFirstVideogame = page * VIDEO_GAMES_PER_PAGE;
      // Indice del ultimo video game de esta pagina
      const indexLastVideogame = indexFirstVideogame + VIDEO_GAMES_PER_PAGE;
      // TODO: Considerar filtros y busquedas con videogames on screen.
      // Generar un nuevo array solo con los elementos entre el primer y ultimo indice.
      const videoGamesToShow = activeVideogames.slice(
        indexFirstVideogame,
        indexLastVideogame
      );
      return {
        ...state,
        videogamesOnScreen: videoGamesToShow,
        currentPage: page,
      };
    default:
      return { ...state };
  }
}

export default rootReducer;
