import {
  ALPH_ORDER,
  GET_GENRES,
  GET_VIDEOGAMES,
  LOADING_VIDEOGAMES,
  FINISH_LOADING_VIDEOGAMES,
  ERROR_VIDEOGAMES,
  SELECT_GENRE,
  SELECT_PLATFORM,
  RATING_ORDER,
  GET_VIDEOGAME_BY_NAME,
  ERROR_VIDEOGAME_BY_NAME,
  CLEAR,
  GO_TO_PAGE,
  SET_STATE_FROM_URL,
  GET_UPCOMING_GAMES,
  LOADING_UPCOMING_GAMES,
  FINISH_LOADING_UPCOMING_GAMES,
  ERROR_UPCOMING_GAMES,
  GET_RECENT_GAMES,
  LOADING_RECENT_GAMES,
  FINISH_LOADING_RECENT_GAMES,
  ERROR_RECENT_GAMES,
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
    sorting: null,
  },
  currentPage: 0,
  numberOfPages: 0,
  loading: false,
  error: null,
  searchError: null,
  searchQuery: null,
  upcomingGames: [],
  loadingUpcoming: false,
  errorUpcoming: null,
  recentGames: [],
  loadingRecentGames: false,
  recentGamesError: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_VIDEOGAMES:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FINISH_LOADING_VIDEOGAMES:
      return {
        ...state,
        loading: false
      };

    case ERROR_VIDEOGAMES:
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
        error: null,
        searchError: null,
      };

    case GET_GENRES:
      return {
        ...state,
        genres: action.payload,
      };
    case GET_VIDEOGAME_BY_NAME: {
      const data = action.payload?.data ?? action.payload;
      const searchQuery = action.payload?.searchQuery ?? null;
      return {
        ...state,
        videogamesOnScreen: Array.isArray(data) ? data : [],
        currentPage: 0,
        numberOfPages: Math.ceil((data?.length || 0) / VIDEO_GAMES_PER_PAGE) || 1,
        searchError: null,
        searchQuery,
      };
    }
    case ERROR_VIDEOGAME_BY_NAME: {
      const errorMsg = typeof action.payload === "string" ? action.payload : action.payload?.error;
      const searchQuery = action.payload?.searchQuery ?? state.searchQuery;
      return {
        ...state,
        videogamesOnScreen: [],
        currentPage: 0,
        numberOfPages: 0,
        searchError: errorMsg,
        searchQuery,
      };
    }
    case SELECT_GENRE: {
      const newFilterStateGenre = {
        ...state.filterAndSortingState,
        genre: action.payload === "-" ? null : action.payload,
      };
      const filteredVideogamesGenre = videogamesForFilter(
        state.videogames,
        newFilterStateGenre
      );
      const paginationSelectGenre = videogamesForPage(
        filteredVideogamesGenre,
        0
      );
      return {
        ...state,
        videogamesOnScreen: paginationSelectGenre,
        filterAndSortingState: newFilterStateGenre,
        currentPage: 0,
        numberOfPages: pagesCount(filteredVideogamesGenre),
      };
    }
    case SELECT_PLATFORM: {
      const newFilterStatePlatform = {
        ...state.filterAndSortingState,
        platform: action.payload === "-" ? null : action.payload,
      };
      const filterVideogamesPlatform = videogamesForFilter(
        state.videogames,
        newFilterStatePlatform
      );
      const videogamePlatformOnScreen = videogamesForPage(
        filterVideogamesPlatform,
        0
      );
      return {
        ...state,
        videogamesOnScreen: videogamePlatformOnScreen,
        filterAndSortingState: newFilterStatePlatform,
        currentPage: 0,
        numberOfPages: pagesCount(filterVideogamesPlatform),
      };
    }

    case ALPH_ORDER: {
      const newFilterStateAlph = {
        ...state.filterAndSortingState,
        sorting: action.payload === "-" ? null : action.payload,
      };
      const filteredVideogamesAlph = videogamesForFilter(
        state.videogames,
        newFilterStateAlph
      );
      const paginationAlph = videogamesForPage(filteredVideogamesAlph, 0);
      return {
        ...state,
        videogamesOnScreen: paginationAlph,
        filterAndSortingState: newFilterStateAlph,
        currentPage: 0,
      };
    }
    case RATING_ORDER: {
      const newFilterStateRating = {
        ...state.filterAndSortingState,
        sorting: action.payload === "-" ? null : action.payload,
      };
      const filteredVideogamesRating = videogamesForFilter(
        state.videogames,
        newFilterStateRating
      );
      const paginationRating = videogamesForPage(filteredVideogamesRating, 0);
      return {
        ...state,
        videogamesOnScreen: paginationRating,
        currentPage: 0,
        filterAndSortingState: newFilterStateRating,
      };
    }
    case CLEAR:
      const newFilterState = {
        genre: null,
        platform: null,
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
        searchError: null,
        searchQuery: null,
      };
    case SET_STATE_FROM_URL: {
      const { genre, platform, sort, page } = action.payload || {};
      const newFilterStateUrl = {
        genre: genre && genre !== "-" ? genre : null,
        platform: platform && platform !== "-" ? platform : null,
        sorting: sort && sort !== "-" ? sort : null,
      };
      const filteredFromUrl = videogamesForFilter(state.videogames, newFilterStateUrl);
      const pageCount = pagesCount(filteredFromUrl);
      const safePage = Math.min(Math.max(0, parseInt(page, 10) || 0), Math.max(0, pageCount - 1));
      const paginationFromUrl = videogamesForPage(filteredFromUrl, safePage);
      return {
        ...state,
        videogamesOnScreen: paginationFromUrl,
        filterAndSortingState: newFilterStateUrl,
        currentPage: safePage,
        numberOfPages: pageCount,
        searchError: null,
        searchQuery: null,
      };
    }
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
    case LOADING_UPCOMING_GAMES:
      return {
        ...state,
        loadingUpcoming: true,
        errorUpcoming: null
      };

    case GET_UPCOMING_GAMES:
      return {
        ...state,
        upcomingGames: action.payload,
        loadingUpcoming: false,
        errorUpcoming: null
      };

    case ERROR_UPCOMING_GAMES:
      return {
        ...state,
        errorUpcoming: action.payload,
        loadingUpcoming: false
      };

    case FINISH_LOADING_UPCOMING_GAMES:
      return {
        ...state,
        loadingUpcoming: false
      };

    case LOADING_RECENT_GAMES:
      return {
        ...state,
        loadingRecentGames: true,
        recentGamesError: null
      };
    
    case GET_RECENT_GAMES:
      return {
        ...state,
        recentGames: action.payload,
        recentGamesError: null
      };
    
    case ERROR_RECENT_GAMES:
      return {
        ...state,
        recentGamesError: action.payload
      };
    
    case FINISH_LOADING_RECENT_GAMES:
      return {
        ...state,
        loadingRecentGames: false
      };

    default:
      return state;
  }
}

export default rootReducer;
