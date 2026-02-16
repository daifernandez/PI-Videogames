const axios = require("axios");

const CHEAPSHARK_BASE = "https://www.cheapshark.com/api/1.0";

// Cache de tiendas (no cambian frecuentemente)
let storesCache = null;
const STORES_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 horas
let storesCacheTimestamp = 0;

/**
 * Obtiene la lista de tiendas desde CheapShark
 */
async function getStores() {
  if (storesCache && Date.now() - storesCacheTimestamp < STORES_CACHE_TTL) {
    return storesCache;
  }
  try {
    const { data } = await axios.get(`${CHEAPSHARK_BASE}/stores`, {
      timeout: 5000,
    });
    storesCache = data;
    storesCacheTimestamp = Date.now();
    return data;
  } catch (error) {
    console.error("Error al obtener tiendas de CheapShark:", error.message);
    return [];
  }
}

/**
 * Busca juegos en CheapShark por título
 * Devuelve el primer resultado que coincida (mejor esfuerzo de matching)
 */
async function searchGameByTitle(gameName) {
  if (!gameName || typeof gameName !== "string") return null;

  try {
    const title = gameName.trim().substring(0, 80);
    const { data } = await axios.get(`${CHEAPSHARK_BASE}/games`, {
      params: { title },
      timeout: 8000,
    });

    if (!Array.isArray(data) || data.length === 0) return null;

    // Intentar mejor match: normalizar y comparar
    const normalizedSearch = normalizeForMatch(gameName);
    const best = data.find((g) => {
      const ext = (g.external || "").toLowerCase();
      return ext.includes(normalizedSearch) || normalizedSearch.includes(ext.substring(0, 20));
    });
    return best || data[0];
  } catch (error) {
    console.error("Error en búsqueda CheapShark:", error.message);
    return null;
  }
}

function normalizeForMatch(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 40);
}

/**
 * Obtiene los deals completos de un juego por gameID
 */
async function getGameDeals(gameID) {
  try {
    const { data } = await axios.get(`${CHEAPSHARK_BASE}/games`, {
      params: { id: gameID },
      timeout: 8000,
    });
    return data;
  } catch (error) {
    console.error("Error al obtener deals de CheapShark:", error.message);
    return null;
  }
}

/**
 * Genera links de fallback para buscar el juego en tiendas principales
 */
function getFallbackStoreLinks(gameName) {
  const encoded = encodeURIComponent(gameName);
  return [
    { storeName: "Steam", url: `https://store.steampowered.com/search/?term=${encoded}` },
    { storeName: "GOG", url: `https://www.gog.com/en/games?search=${encoded}` },
    { storeName: "Epic Games", url: `https://store.epicgames.com/en-US/browse?q=${encoded}` },
    { storeName: "Humble Bundle", url: `https://www.humblebundle.com/store/search?sort=bestselling&search=${encoded}` },
  ];
}

/**
 * Obtiene precios y links de compra para un juego
 */
async function getPricesForGame(gameName) {
  const stores = await getStores();
  const storeMap = new Map(stores.map((s) => [s.storeID, s.storeName]));

  const searchResult = await searchGameByTitle(gameName);
  if (!searchResult) {
    return {
      deals: [],
      fallbackLinks: getFallbackStoreLinks(gameName),
      source: "fallback",
    };
  }

  const gameDetails = await getGameDeals(searchResult.gameID);
  if (!gameDetails?.deals || gameDetails.deals.length === 0) {
    return {
      deals: [],
      fallbackLinks: getFallbackStoreLinks(gameName),
      source: "fallback",
    };
  }

  const deals = gameDetails.deals.map((d) => ({
    storeID: d.storeID,
    storeName: storeMap.get(d.storeID) || `Store ${d.storeID}`,
    price: parseFloat(d.price),
    retailPrice: parseFloat(d.retailPrice),
    savings: parseFloat(d.savings || 0),
    dealUrl: `https://www.cheapshark.com/redirect?dealID=${d.dealID}`,
  }));

  // Ordenar por precio ascendente
  deals.sort((a, b) => a.price - b.price);

  return {
    deals,
    fallbackLinks: getFallbackStoreLinks(gameName),
    source: "cheapshark",
    cheapestPriceEver: gameDetails.cheapestPriceEver
      ? { price: parseFloat(gameDetails.cheapestPriceEver.price), date: gameDetails.cheapestPriceEver.date }
      : null,
  };
}

module.exports = {
  getPricesForGame,
  getFallbackStoreLinks,
};
