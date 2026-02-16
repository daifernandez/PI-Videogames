import { useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStateFromUrl, getVideogameByName } from "../Redux/actions";

const PARAM_GENRE = "genre";
const PARAM_PLATFORM = "platform";
const PARAM_SORT = "sort";
const PARAM_PAGE = "page";
const PARAM_SEARCH = "search";

/**
 * Lee parámetros de la URL y devuelve un objeto con los valores parseados.
 */
export function parseUrlParams(searchParams) {
  const genre = searchParams.get(PARAM_GENRE);
  const platform = searchParams.get(PARAM_PLATFORM);
  const sort = searchParams.get(PARAM_SORT);
  const page = parseInt(searchParams.get(PARAM_PAGE), 10);
  const search = searchParams.get(PARAM_SEARCH);
  return {
    genre: genre || null,
    platform: platform || null,
    sort: sort || null,
    page: Number.isFinite(page) ? page : null,
    search: search ? search.trim() : null,
  };
}

/**
 * Construye un objeto de searchParams desde el estado actual.
 */
export function buildSearchParams(state) {
  const params = {};
  const { genre, platform, sorting } = state.filterAndSortingState || {};
  if (genre) params[PARAM_GENRE] = genre;
  if (platform) params[PARAM_PLATFORM] = platform;
  if (sorting) params[PARAM_SORT] = sorting;
  if (state.currentPage > 0) params[PARAM_PAGE] = String(state.currentPage + 1);
  if (state.searchQuery) params[PARAM_SEARCH] = state.searchQuery;
  return params;
}

/**
 * Hook para sincronizar el estado de Home (filtros, paginación, búsqueda) con la URL.
 * - Al montar o al cargar videogames: aplica el estado desde la URL.
 * - Cuando cambia el estado en Redux: actualiza la URL (replace).
 * - Escucha popstate para restaurar estado al usar Back/Forward.
 */
export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const lastUrlWeWrote = useRef(null);

  const filterAndSortingState = useSelector((state) => state.filterAndSortingState);
  const currentPage = useSelector((state) => state.currentPage);
  const searchQuery = useSelector((state) => state.searchQuery);
  const videogames = useSelector((state) => state.videogames || []);

  const isOnHome = location.pathname === "/home";
  const hasLoadedOnce = useRef(false);

  // Aplicar estado desde la URL
  useEffect(() => {
    if (!isOnHome) return;
    const params = parseUrlParams(searchParams);

    if (params.search) {
      dispatch(getVideogameByName(params.search));
      return;
    }

    if (videogames.length > 0) {
      dispatch(
        setStateFromUrl({
          genre: params.genre || "-",
          platform: params.platform || "-",
          sort: params.sort || "-",
          page: params.page !== null ? params.page - 1 : 0,
        })
      );
    }
  }, [isOnHome, searchParams, dispatch, videogames.length]);

  // Sincronizar Redux → URL (no en el primer mount para no interferir con la carga inicial)
  useEffect(() => {
    if (!isOnHome) return;
    if (!hasLoadedOnce.current && videogames.length === 0 && !searchQuery) return;

    hasLoadedOnce.current = true;
    const params = buildSearchParams({
      filterAndSortingState,
      currentPage,
      searchQuery,
    });
    const next = new URLSearchParams(params);
    const nextStr = next.toString();

    if (nextStr !== lastUrlWeWrote.current) {
      lastUrlWeWrote.current = nextStr;
      setSearchParams(next, { replace: true });
    }
  }, [
    isOnHome,
    filterAndSortingState,
    currentPage,
    searchQuery,
    setSearchParams,
    videogames.length,
  ]);

  // Popstate: usuario usó Back/Forward
  useEffect(() => {
    if (!isOnHome) return;
    const handlePopState = () => {
      lastUrlWeWrote.current = null;
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOnHome]);

  return { parseUrlParams: () => parseUrlParams(searchParams) };
}
