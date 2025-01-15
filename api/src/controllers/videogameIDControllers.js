const {
  get_videogame_detail,
  delete_videogameDB,
} = require("../helpers/videogamesHelpers.js");

const get_videogameDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const videogame = await get_videogame_detail(id);
    res.status(200).send(videogame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const delete_videogame = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedVideogame = await delete_videogameDB(id);
    res.status(200).send(deletedVideogame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const get_videogameTrailers = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 5 } = req.query;
  
  try {
    const videogame = await get_videogame_detail(id);
    if (!videogame.trailers) {
      return res.status(200).json({ trailers: [], total: 0, pages: 0 });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedTrailers = videogame.trailers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(videogame.trailers.length / limit);

    res.status(200).json({
      trailers: paginatedTrailers,
      total: videogame.trailers.length,
      pages: totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const get_videogameScreenshots = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  try {
    const videogame = await get_videogame_detail(id);
    if (!videogame.screenshots) {
      return res.status(200).json({ screenshots: [], total: 0, pages: 0 });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedScreenshots = videogame.screenshots.slice(startIndex, endIndex);
    const totalPages = Math.ceil(videogame.screenshots.length / limit);

    res.status(200).json({
      screenshots: paginatedScreenshots,
      total: videogame.screenshots.length,
      pages: totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  get_videogameDetail,
  delete_videogame,
  get_videogameTrailers,
  get_videogameScreenshots
};
