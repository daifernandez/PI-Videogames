const { Videogame, Genre } = require("../db");
const axios = require("axios");

const get_videogame_db = async () => {
  const videogames = await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ["name"],
      through: { attributes: [] },
    },
  });

  return videogames.map((videogame) => {
    console.log(videogame.genres);
    return {
      id: videogame.id,
      name: videogame.name,
      image: videogame.image,
      description: videogame.description,
      released: videogame.released,
      rating: videogame.rating,
      platforms: videogame.platforms,
      genres: videogame.genres.map((genres) => genres.name),
      createdInDB: videogame.createdInDB,
    };
  });
};

const api_videogameParse = (apiObject) => {
  const platformNames = apiObject.platforms.map((element) => {
    return element.platform.name;
  });

  const genresApi = apiObject.genres.map((el) => {
    return el.name;
  });

  return {
    id: apiObject.id,
    name: apiObject.name,
    image: apiObject.background_image,
    rating: apiObject.rating,
    platforms: platformNames,
    genres: genresApi,
    description: apiObject.description,
  };
};

const get_videogame_api = async () => {
  const urlApi = await axios.get(
    `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page_size=100`
  );

  const videogamesApi = urlApi.data.results.map((apiObject) => {
    return api_videogameParse(apiObject);
  });

  return videogamesApi;
};

const get_allVideogames = async () => {
  const apiVideogames = await get_videogame_api();
  const dbVideogames = await get_videogame_db();
  const allVideogames = [...apiVideogames, ...dbVideogames];
  return allVideogames;
};

const get_videogame_byName = async (name) => {
  const videogameSearch = await axios
    .get(
      `https://api.rawg.io/api/games?search=${name}&key=${process.env.API_KEY}`
    )
    .catch(function (error) {
      throw new Error(error.message);
    });

  const videogamesApi = videogameSearch.data.results
    .slice(0, 15)
    .map((apiObject) => {
      return api_videogameParse(apiObject);
    });

  return videogamesApi;
};

const get_videogame_detail = async (id) => {
  const videogameDetail = await axios
    .get(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`)
    .catch(function (error) {
      throw new Error(error.message);
    });

  const result = api_videogameParse(videogameDetail.data);
  return result;
};

const delete_videogameDB = async (id) => {
  const videogameDelete = await Videogame.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  get_videogame_db,
  get_videogame_api,
  get_allVideogames,
  get_videogame_byName,
  get_videogame_detail,
  delete_videogameDB,
};
