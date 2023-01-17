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
  numberOfPages: 0,
  platforms: [],
  activeFiltersAndSorting: {},
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VIDEOGAMES:
      const platforms = action.payload.map((el) => el.platforms).flat();
      const uniquePlatforms = new Set(platforms);
      const paginationGetVideogames = paginationForVideogames(
        videogamesForFilter(action.payload, state.activeFiltersAndSorting),
        state.currentPage
      );
      return {
        ...state,
        videogames: action.payload,
        videogamesOnScreen: paginationGetVideogames.videogamesForPage,
        numberOfPages: paginationGetVideogames.numberOfPages,
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
      const updatedVideogames = [...state.videogames].filter(
        (videogame) => videogame.id !== action.payload.id
      );
      const paginationDeleteDB = paginationForVideogames(
        videogamesForFilter(updatedVideogames, state.activeFiltersAndSorting),
        state.currentPage
      );
      return {
        ...state,
        videogames: updatedVideogames,
        videogamesOnScreen: paginationDeleteDB.videogamesForPage,
        numberOfPages: paginationDeleteDB.numberOfPages,
      };
    case SELECT_GENRE:
      var activeFilters = state.activeFiltersAndSorting;
      activeFilters.genre = action.payload === "-" ? null : action.payload;
      const paginationSelectGenre = paginationForVideogames(
        videogamesForFilter(state.videogames, activeFilters),
        0
      );
      return {
        ...state,
        videogamesOnScreen: paginationSelectGenre.videogamesForPage,
        activeFilters: activeFilters,
        currentPage: 0,
        numberOfPages: paginationSelectGenre.numberOfPages,
      };
    case POST_VIDEOGAME:
      var updatedAllVideogames = [...state.videogames];
      updatedAllVideogames.push(action.payload);
      return {
        ...state,
        videogames: updatedAllVideogames,
      };
    case GET_CREATED:
      var activeFilters = state.activeFiltersAndSorting;
      if (action.payload === "all") {
        activeFilters.createdIn = null;
      } else {
        activeFilters.createdIn =
          action.payload === "createdInDB" ? "DB" : "API";
      }
      const paginationCreated = paginationForVideogames(
        videogamesForFilter(state.videogames, activeFilters),
        0
      );
      return {
        ...state,
        videogamesOnScreen: paginationCreated.videogamesForPage,
        activeFilters: activeFilters,
        currentPage: 0,
        numberOfPages: paginationCreated.numberOfPages,
      };

    case ALPH_ORDER:
      var activeFilters = state.activeFiltersAndSorting;
      activeFilters.sorting = action.payload === "-" ? null : action.payload;
      const paginationAlph = paginationForVideogames(
        videogamesForFilter(state.videogames, activeFilters),
        0
      );
      return {
        ...state,
        videogamesOnScreen: paginationAlph.videogamesForPage,
        activeFilters: activeFilters,
        currentPage: 0,
        numberOfPages: paginationAlph.numberOfPages,
      };
    case RATING_ORDER:
      var activeFilters = state.activeFiltersAndSorting;
      activeFilters.sorting = action.payload === "-" ? null : action.payload;
      const paginationRating = paginationForVideogames(
        videogamesForFilter(state.videogames, activeFilters),
        0
      );
      return {
        ...state,
        videogamesOnScreen: paginationRating.videogamesForPage,
        currentPage: 0,
        numberOfPages: paginationRating.numberOfPages,
        activeFilters: activeFilters,
      };
    case CLEAR:
      activeFilters = {
        genre: null,
        createdIn: null,
        sorting: null,
      };
      const currentPage = 0;
      const paginationClear = paginationForVideogames(
        videogamesForFilter(state.videogames, activeFilters),
        currentPage
      );
      return {
        ...state,
        videogamesOnScreen: paginationClear.videogamesForPage,
        currentPage: currentPage,
        numberOfPages: paginationClear.numberOfPages,
        activeFilters: activeFilters,
      };
    case GO_TO_PAGE:
      const page = action.payload;
      const paginationGoToPage = paginationForVideogames(
        videogamesForFilter(state.videogames, state.activeFiltersAndSorting),
        page
      );
      return {
        ...state,
        videogamesOnScreen: paginationGoToPage.videogamesForPage,
        currentPage: page,
        numberOfPages: paginationGoToPage.numberOfPages,
      };
    default:
      return { ...state };
  }
}

function videogamesForFilter(videogames, activeFilters) {
  var videogamesForFilter = videogames.filter((videogame) => {
    if (activeFilters.genre) {
      if (!videogame.genres.includes(activeFilters.genre)) {
        return false;
      }
    }

    if (activeFilters.createdIn) {
      switch (activeFilters.createdIn) {
        case "API":
          if (videogame.createdInDB) {
            return false;
          }
          break;
        case "DB":
          if (!videogame.createdInDB) {
            return false;
          }
          break;
        default:
      }
    }

    return true;
  });

  if (activeFilters.sorting) {
    videogamesForFilter.sort((a, b) => {
      switch (activeFilters.sorting) {
        case "A-Z":
          return a.name.localeCompare(b.name);
        case "Z-A":
          return b.name.localeCompare(a.name);
        case "1-5":
          return a.rating - b.rating;
        case "5-1":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }

  return videogamesForFilter;
}

function paginationForVideogames(videogames, page) {
  //busco los elementos a mostrar en una pagina tal
  const indexFirstVideogame = page * VIDEO_GAMES_PER_PAGE;
  const indexLastVideogame = indexFirstVideogame + VIDEO_GAMES_PER_PAGE;
  const videogamesForPage = videogames.slice(
    indexFirstVideogame,
    indexLastVideogame
  );
  // la cantidad de paginas que me lleva el array
  const numberOfPages = Math.ceil(videogames.length / VIDEO_GAMES_PER_PAGE);

  return {
    videogamesForPage: videogamesForPage,
    numberOfPages: numberOfPages,
  };
}

export default rootReducer;
