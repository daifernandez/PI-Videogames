const { Videogame, Genre } = require("../db");
const axios = require("axios");
const { Op } = require("sequelize");

const get_allVideogames = async () => {
  try {
    const apiVideogames = await get_videogame_api();
    const dbVideogames = await get_videogame_db();
    const allVideogames = [...apiVideogames, ...dbVideogames];
    return allVideogames;
  } catch (error) {
    throw new Error(error.message);
  }
};

const get_videogame_db = async () => {
  const videogames = await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ["name"],
      through: { attributes: [] },
    },
  });

  return videogames.map((videogame) => {
    return {
      ...videogame.dataValues,
      genres: videogame.genres.map((genres) => genres.name),
    };
  });
};

const get_videogame_api = async () => {
  const pagesToFetch = [
    {
      pageSize: 40,
      page: 1,
    },
    {
      pageSize: 40,
      page: 2,
    },
    {
      pageSize: 20,
      page: 5,
    },
  ];

  var allVideogames = [];
  for (pageData of pagesToFetch) {
    const urlApi = await axios
      .get(
        `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page_size=${pageData.pageSize}&page=${pageData.page}`
      )
      .catch(function (error) {
        throw new Error(error.message);
      });
    allVideogames = allVideogames.concat(urlApi.data.results);
  }

  const videogamesApi = allVideogames.map((apiObject) => {
    return api_videogameParse(apiObject);
  });

  return videogamesApi;
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
    released: apiObject.released,
    platforms: platformNames,
    genres: genresApi,
    description: apiObject.description,
  };
};

const get_videogame_byName = async (name) => {
  const videogameApiSearch = await axios
    .get(
      `https://api.rawg.io/api/games?search=${name}&search_exact=true&key=${process.env.API_KEY}`
    )
    .catch(function (error) {
      throw new Error(error.message);
    });

  const videogameDBSearch = await get_videogame_db_byName(name);

  const videogamesApi = videogameApiSearch.data.results.map((apiObject) => {
    return api_videogameParse(apiObject);
  });

  return [...videogamesApi, ...videogameDBSearch];
};

const get_videogame_db_byName = async (name) => {
  const dbVideogameName = await Videogame.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`,
      },
    },
    include: {
      model: Genre,
      attributes: ["name"],
      through: { attributes: [] },
    },
  });

  return dbVideogameName.map((videogame) => {
    return {
      ...videogame.dataValues,
      genres: videogame.genres.map((genres) => genres.name),
    };
  });
};

const get_videogame_detail = async (id) => {
  if (id.includes("-")) {
    const videogameDBFind = await Videogame.findByPk(id, {
      include: {
        model: Genre,
        attributes: ["name"],
        through: { attributes: [] },
      },
    }).catch(function (error) {
      throw new Error(error.message);
    });
    if (videogameDBFind) {
      return {
        ...videogameDBFind.dataValues,
        genres: videogameDBFind.genres.map((genres) => genres.name),
      };
    }
  } else {
    const videogameDetail = await axios
      .get(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`)
      .catch(function (error) {
        throw new Error(error.message);
      });

    const result = api_videogameParse(videogameDetail.data);
    return result;
  }
};

const delete_videogameDB = async (id) => {
  const videogameToDelete = await Videogame.findByPk(id);
  if (videogameToDelete) {
    await videogameToDelete.destroy().catch(function (error) {
      throw new Error(error.message);
    });
    return videogameToDelete;
  } else {
    throw new Error("Videogame not found");
  }
};

module.exports = {
  get_videogame_db,
  get_videogame_api,
  get_allVideogames,
  get_videogame_byName,
  get_videogame_detail,
  delete_videogameDB,
};
