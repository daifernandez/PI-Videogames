const { get_all_genres_helper } = require("../helpers/genresHelpers");
const { Router } = require("express");

const genresRouter = Router();

// GET genres
genresRouter.get("/", async (req, res) => {
  try {
    const genres = await get_all_genres_helper();
    return res.status(200).json(genres);
  } catch (error) {
    return res.status(400).send(error.messenge);
  }
});

module.exports = genresRouter;