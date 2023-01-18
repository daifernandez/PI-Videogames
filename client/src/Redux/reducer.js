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
  activeFiltersAndSorting: {
    genre: null,
    origin: null,
    sorting: null,
  },
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VIDEOGAMES:
      const platforms = action.payload.map((el) => el.platforms).flat();
      const uniquePlatforms = new Set(platforms);
      const videogames = action.payload;
      const paginationGetVideogames = videogamesForPage(
        videogames,
        state.currentPage
      );
      return {
        ...state,
        videogames: videogames,
        videogamesOnScreen: paginationGetVideogames,
        numberOfPages: pagesCount(videogames),
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
        currentPage: 0,
        numberOfPages: 1,
      };
    case DELETE_DB_VIDEOGAME:
      const updatedVideogames = [...state.videogames].filter(
        (videogame) => videogame.id !== action.payload.id
      );
      const filteredVideogamesDeleteDB = videogamesForFilter(
        updatedVideogames,
        state.activeFiltersAndSorting
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
      var activeFilters = state.activeFiltersAndSorting;
      activeFilters.genre = action.payload === "-" ? null : action.payload;

      const filteredVideogamesGenre = videogamesForFilter(
        state.videogames,
        activeFilters
      );
      const paginationSelectGenre = videogamesForPage(
        filteredVideogamesGenre,
        0
      );
      return {
        ...state,
        videogamesOnScreen: paginationSelectGenre,
        activeFilters: activeFilters,
        currentPage: 0,
        numberOfPages: pagesCount(filteredVideogamesGenre),
      };
    case POST_VIDEOGAME:
      var updatedAllVideogames = [...state.videogames];
      updatedAllVideogames.push(action.payload);
      return {
        ...state,
        videogames: [...updatedAllVideogames],
      };
    case GET_CREATED:
      var activeFilters = state.activeFiltersAndSorting;
      if (action.payload === "all") {
        activeFilters.origin = null;
      } else {
        activeFilters.origin = action.payload === "createdInDB" ? "DB" : "API";
      }

      const filteredVideogamesCreated = videogamesForFilter(
        state.videogames,
        activeFilters
      );
      const paginationCreated = videogamesForPage(filteredVideogamesCreated, 0);

      return {
        ...state,
        videogamesOnScreen: paginationCreated,
        activeFilters: activeFilters,
        currentPage: 0,
        numberOfPages: pagesCount(filteredVideogamesCreated),
      };

    case ALPH_ORDER:
      var activeFilters = state.activeFiltersAndSorting;
      activeFilters.sorting = action.payload === "-" ? null : action.payload;

      const filteredVideogamesAlph = videogamesForFilter(
        state.videogames,
        activeFilters
      );
      const paginationAlph = videogamesForPage(filteredVideogamesAlph, 0);
      return {
        ...state,
        videogamesOnScreen: paginationAlph,
        activeFilters: activeFilters,
        currentPage: 0,
      };
    case RATING_ORDER:
      var activeFilters = state.activeFiltersAndSorting;
      activeFilters.sorting = action.payload === "-" ? null : action.payload;
      const filteredVideogamesRating = videogamesForFilter(
        state.videogames,
        activeFilters
      );
      const paginationRating = videogamesForPage(filteredVideogamesRating, 0);
      return {
        ...state,
        videogamesOnScreen: paginationRating,
        currentPage: 0,
        activeFilters: activeFilters,
      };
    case CLEAR:
      activeFilters = {
        genre: null,
        origin: null,
        sorting: null,
      };
      const currentPage = 0;
      const filteredVideogamesClear = videogamesForFilter(
        state.videogames,
        activeFilters
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
        activeFilters: activeFilters,
      };
    case GO_TO_PAGE:
      const page = action.payload;
      const filteredVideogamesGoToPage = videogamesForFilter(
        state.videogames,
        state.activeFiltersAndSorting
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

    if (activeFilters.origin) {
      switch (activeFilters.origin) {
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

function videogamesForPage(videogames, page) {
  //busco los elementos a mostrar en una pagina tal
  const indexFirstVideogame = page * VIDEO_GAMES_PER_PAGE;
  const indexLastVideogame = indexFirstVideogame + VIDEO_GAMES_PER_PAGE;
  const videogamesForPage = videogames.slice(
    indexFirstVideogame,
    indexLastVideogame
  );

  return videogamesForPage;
}

function pagesCount(videogames) {
  // la cantidad de paginas que me llevan los videojuegos filtrados
  return Math.ceil(videogames.length / VIDEO_GAMES_PER_PAGE);
}

export default rootReducer;
