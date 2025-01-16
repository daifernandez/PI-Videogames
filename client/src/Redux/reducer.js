import {
  ALPH_ORDER,
  GET_GENRES,
  GET_VIDEOGAMES,
  SELECT_GENRE,
  SELECT_PLATFORM,
  RATING_ORDER,
  GET_CREATED,
  GET_VIDEOGAME_BY_NAME,
  CLEAR,
  POST_VIDEOGAME,
  GO_TO_PAGE,
  DELETE_DB_VIDEOGAME,
} from "./actions";

const VIDEO_GAMES_PER_PAGE = 16;

// Funciones auxiliares
function videogamesForFilter(videogames, filterAndSortingState) {
  var videogamesForFilter = videogames.filter((videogame) => {
    if (filterAndSortingState.genre) {
      if (!videogame.genres.includes(filterAndSortingState.genre)) {
        return false;
      }
    }

    if (filterAndSortingState.platform) {
      if (!videogame.platforms.includes(filterAndSortingState.platform)) {
        return false;
      }
    }

    if (filterAndSortingState.origin) {
      switch (filterAndSortingState.origin) {
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

  if (filterAndSortingState.sorting) {
    videogamesForFilter.sort((a, b) => {
      switch (filterAndSortingState.sorting) {
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

function videogamesForPage(videogames, page) {
  const indexFirstVideogame = page * VIDEO_GAMES_PER_PAGE;
  const indexLastVideogame = indexFirstVideogame + VIDEO_GAMES_PER_PAGE;
  const videogamesForPage = videogames.slice(
    indexFirstVideogame,
    indexLastVideogame
  );
  return videogamesForPage;
}

function pagesCount(videogames) {
  return Math.ceil(videogames.length / VIDEO_GAMES_PER_PAGE);
}

const initialState = {
  videogames: [],
  videogamesOnScreen: [],
  genres: [],
  platforms: [],
  filterAndSortingState: {
    genre: null,
    platform: null,
    origin: null,
    sorting: null,
  },
  currentPage: 0,
  numberOfPages: 0,
  loading: false,
  error: null
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "LOADING_VIDEOGAMES":
      return {
        ...state,
        loading: true,
        error: null
      };

    case "FINISH_LOADING_VIDEOGAMES":
      return {
        ...state,
        loading: false
      };

    case "ERROR_VIDEOGAMES":
      return {
        ...state,
        loading: false,
        error: action.payload,
        videogames: [],
        videogamesOnScreen: []
      };

    case GET_VIDEOGAMES:
      const platforms = new Set();
      action.payload.forEach((videogame) => {
        videogame.platforms.forEach((platform) => {
          platforms.add(platform);
        });
      });

      const initialPage = 0;
      const filteredVideogamesInitial = videogamesForFilter(
        action.payload,
        state.filterAndSortingState
      );
      const initialPagination = videogamesForPage(
        filteredVideogamesInitial,
        initialPage
      );

      return {
        ...state,
        videogames: action.payload,
        videogamesOnScreen: initialPagination,
        platforms: Array.from(platforms).sort(),
        numberOfPages: pagesCount(filteredVideogamesInitial),
        currentPage: initialPage,
        loading: false,
        error: null
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
        currentPage: 0,
        numberOfPages: 1,
      };
    case DELETE_DB_VIDEOGAME:
      const updatedVideogames = [...state.videogames].filter(
        (videogame) => videogame.id !== action.payload.id
      );
      const filteredVideogamesDeleteDB = videogamesForFilter(
        updatedVideogames,
        state.filterAndSortingState
      );
      const videogamesForPageDeleteDB = videogamesForPage(
        filteredVideogamesDeleteDB,
        state.currentPage
      );
      return {
        ...state,
        videogames: updatedVideogames,
        videogamesOnScreen: videogamesForPageDeleteDB,
        numberOfPages: pagesCount(filteredVideogamesDeleteDB),
      };
    case SELECT_GENRE:
      state.filterAndSortingState.genre =
        action.payload === "-" ? null : action.payload;

      const filteredVideogamesGenre = videogamesForFilter(
        state.videogames,
        state.filterAndSortingState
      );
      const paginationSelectGenre = videogamesForPage(
        filteredVideogamesGenre,
        0
      );
      return {
        ...state,
        videogamesOnScreen: paginationSelectGenre,
        filterAndSortingState: state.filterAndSortingState,
        currentPage: 0,
        numberOfPages: pagesCount(filteredVideogamesGenre),
      };
    case SELECT_PLATFORM:
      state.filterAndSortingState.platform =
        action.payload === "-" ? null : action.payload;

      const filterVideogamesPlatform = videogamesForFilter(
        state.videogames,
        state.filterAndSortingState
      );

      const videogamePlatformOnScreen = videogamesForPage(
        filterVideogamesPlatform,
        0
      );
      return {
        ...state,
        videogamesOnScreen: videogamePlatformOnScreen,
        currentPage: 0,
        numberOfPages: pagesCount(filterVideogamesPlatform),
      };

    case POST_VIDEOGAME:
      var updatedAllVideogames = [...state.videogames];
      updatedAllVideogames.push(action.payload);
      return {
        ...state,
        videogames: [...updatedAllVideogames],
      };
    case GET_CREATED:
      var filterAndSortingState = state.filterAndSortingState;
      if (action.payload === "all") {
        filterAndSortingState.origin = null;
      } else {
        filterAndSortingState.origin = action.payload;
      }

      const filteredVideogamesCreated = videogamesForFilter(
        state.videogames,
        filterAndSortingState
      );
      const paginationCreated = videogamesForPage(filteredVideogamesCreated, 0);

      return {
        ...state,
        videogamesOnScreen: paginationCreated,
        filterAndSortingState: filterAndSortingState,
        currentPage: 0,
        numberOfPages: pagesCount(filteredVideogamesCreated),
      };

    case ALPH_ORDER:
      state.filterAndSortingState.sorting =
        action.payload === "-" ? null : action.payload;

      const filteredVideogamesAlph = videogamesForFilter(
        state.videogames,
        state.filterAndSortingState
      );
      const paginationAlph = videogamesForPage(filteredVideogamesAlph, 0);
      return {
        ...state,
        videogamesOnScreen: paginationAlph,
        filterAndSortingState: state.filterAndSortingState,
        currentPage: 0,
      };
    case RATING_ORDER:
      state.filterAndSortingState.sorting =
        action.payload === "-" ? null : action.payload;
      const filteredVideogamesRating = videogamesForFilter(
        state.videogames,
        state.filterAndSortingState
      );
      const paginationRating = videogamesForPage(filteredVideogamesRating, 0);
      return {
        ...state,
        videogamesOnScreen: paginationRating,
        currentPage: 0,
        filterAndSortingState: state.filterAndSortingState,
      };
    case CLEAR:
      const newFilterState = {
        genre: null,
        platform: null,
        origin: null,
        sorting: null,
      };
      const currentPage = 0;
      const filteredVideogamesClear = videogamesForFilter(
        state.videogames,
        newFilterState
      );
      const paginationClear = videogamesForPage(
        filteredVideogamesClear,
        currentPage
      );
      return {
        ...state,
        videogamesOnScreen: paginationClear,
        currentPage: currentPage,
        numberOfPages: pagesCount(filteredVideogamesClear),
        filterAndSortingState: newFilterState,
      };
    case GO_TO_PAGE:
      const page = action.payload;
      const filteredVideogamesGoToPage = videogamesForFilter(
        state.videogames,
        state.filterAndSortingState
      );
      const paginationGoToPage = videogamesForPage(
        filteredVideogamesGoToPage,
        page
      );
      return {
        ...state,
        videogamesOnScreen: paginationGoToPage,
        currentPage: page,
      };
    default:
      return state;
  }
}

export default rootReducer;
