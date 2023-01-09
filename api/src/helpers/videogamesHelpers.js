const { Videogame, Genre } = require("../db");
const axios = require("axios");
const { Op } = require("sequelize");
const { v4: isUuid } = require("uuid");

let local_videogames = require("./local_videogames.json");

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
    released: apiObject.released,
    platforms: platformNames,
    genres: genresApi,
    description: apiObject.description,
  };
};

const get_videogame_api = async () => {
  const pagesToFetch = [1, 2, 3];
  // var allVideogames = [];
  var allVideogames = local_videogames;
  // for (pageNumber of pagesToFetch) {
  //   console.log(pageNumber);
  //   const urlApi = await axios.get(
  //     `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page_size=40&page=${pageNumber}`
  //   );

  //   allVideogames = allVideogames.concat(urlApi.data.results);
  // }

  const videogamesApi = allVideogames.map((apiObject) => {
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

  console.log(dbVideogameName);

  return dbVideogameName.map((videogame) => {
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

const get_videogame_byName = async (name) => {
  const videogameApiSearch = await axios
    .get(
      `https://api.rawg.io/api/games?search=${name}&key=${process.env.API_KEY}`
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

const get_videogame_detail = async (id) => {
  if (isUuid(id)) {
    const videogameDBFind = await Videogame.findByPk(id, {
      include: {
        model: Genre,
        attributes: ["name"],
        through: { attributes: [] },
      },
    });
    if (videogameDBFind) {
      return {
        id: videogameDBFind.id,
        name: videogameDBFind.name,
        image: videogameDBFind.image,
        description: videogameDBFind.description,
        released: videogameDBFind.released,
        rating: videogameDBFind.rating,
        platforms: videogameDBFind.platforms,
        genres: videogameDBFind.genres.map((genres) => genres.name),
        createdInDB: videogameDBFind.createdInDB,
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
    videogameToDelete.destroy().catch(function (error) {
      throw new Error(error.message);
    });
  } else {
    throw new Error("Videogame not found");
  }
};

const updateVideogame = async (id) => {
  const videogameToUpdate = await Videogame.findByPk(id);
  if (videogameToUpdate) {
    videogameToUpdate.name = name;
    videogameToUpdate.description = description;
    videogameToUpdate.image = image;
    videogameToUpdate.released = released;
    videogameToUpdate.rating = rating;
    videogameToUpdate.platform = platform;
    videogameToUpdate.genres = genres;
    return videogameToUpdate;
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
  updateVideogame,
};
