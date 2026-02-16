const { get_videogame_detail } = require("../helpers/videogamesHelpers.js");
const { getPricesForGame } = require("../helpers/pricesHelper.js");

/**
 * Obtiene precios y dónde comprar para un videojuego por ID
 */
const getVideogamePrices = async (req, res) => {
  const { id } = req.params;

  try {
    const videogame = await get_videogame_detail(id);
    const gameName = videogame?.name;

    if (!gameName) {
      return res.status(200).json({
        deals: [],
        fallbackLinks: [],
        source: "none",
      });
    }

    const result = await getPricesForGame(gameName);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getVideogamePrices:", error);
    if (error.message?.includes("no encontrado") || error.message?.includes("not found")) {
      return res.status(404).json({ error: "Videojuego no encontrado" });
    }
    return res.status(500).json({
      error: "Error al obtener precios",
      deals: [],
      fallbackLinks: [],
    });
  }
};

module.exports = {
  getVideogamePrices,
};
