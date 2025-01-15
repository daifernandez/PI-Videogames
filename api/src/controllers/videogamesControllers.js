const { Videogame, Genre } = require("../db");
const {
  get_allVideogames,
  get_videogame_byName,
  get_videogame_detail,
} = require("../helpers/videogamesHelpers.js");
const axios = require("axios");

const get_videogames = async (req, res) => {
  const { name } = req.query;
  
  try {
    if (name) {
      const videogamesByName = await get_videogame_byName(name);
      if (!videogamesByName || videogamesByName.length === 0) {
        return res.status(404).json({ 
          error: "No se encontraron videojuegos con ese nombre" 
        });
      }
      return res.status(200).json(videogamesByName);
    } 

    const videogamesTotal = await get_allVideogames();
    if (!videogamesTotal || videogamesTotal.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron videojuegos" 
      });
    }
    return res.status(200).json(videogamesTotal);

  } catch (error) {
    console.error("Error en get_videogames:", error);
    
    // Errores específicos
    if (error.message.includes("API_KEY")) {
      return res.status(500).json({ 
        error: "Error de configuración del servidor: API_KEY no válida" 
      });
    }
    
    if (error.message.includes("RAWG")) {
      return res.status(503).json({ 
        error: "Error al comunicarse con el servicio externo" 
      });
    }

    // Error general
    return res.status(500).json({ 
      error: "Error interno del servidor al obtener los videojuegos",
      details: error.message 
    });
  }
};

const create_videogame = async (req, res) => {
  const { 
    name, 
    image, 
    description, 
    released, 
    rating, 
    platforms, 
    genres,
    website,
    trailers,
    screenshots,
    esrb_rating,
    publishers,
    developers
  } = req.body;

  try {
    // Creo el video juego con las propiedades pero sin relacion a generos.
    const videogame = await Videogame.create({
      name,
      image,
      description,
      released: released === "" ? null : released,
      rating,
      platforms,
      website,
      trailers,
      screenshots,
      esrb_rating,
      publishers,
      developers,
      createdInDB: true,
    });

    // Busco los generos en la base de datos a partir de los nombres de los generos pasados por body.
    const genresDb = await Genre.findAll({ where: { name: genres } });
    // Creamos la relacion entre videogame y generos en la base de datos.
    await videogame.addGenres(genresDb);

    // Traemos el videojuego CON relaciones de la base de datos para devolverlo.
    const videogameWithRelation = await Videogame.findByPk(videogame.id, {
      include: {
        model: Genre,
        attributes: ["name"],
        through: { attributes: [] },
      },
    });

    res.status(200).send({
      ...videogameWithRelation.dataValues,
      genres: videogameWithRelation.genres.map((genres) => genres.name),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const get_media = async (req, res) => {
  const { id, type } = req.params;
  const { page = 1 } = req.query;
  const itemsPerPage = 6;

  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY no configurada");
    }

    if (!['screenshots', 'trailers'].includes(type)) {
      return res.status(400).json({ error: "Tipo de medio no válido" });
    }

    // Hacer la petición específica según el tipo
    let response;
    if (type === 'screenshots') {
      response = await axios.get(
        `https://api.rawg.io/api/games/${id}/screenshots?key=${process.env.API_KEY}`
      );
    } else {
      // Para trailers, primero intentamos obtener los movies
      response = await axios.get(
        `https://api.rawg.io/api/games/${id}/movies?key=${process.env.API_KEY}`
      );

      // Si no hay movies, intentamos obtener los videos de YouTube
      if (!response.data.results || response.data.results.length === 0) {
        const gameDetails = await axios.get(
          `https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`
        );

        // Si el juego tiene un clip o video promocional
        if (gameDetails.data.clip || gameDetails.data.reddit_video_preview) {
          const videoData = gameDetails.data.clip || gameDetails.data.reddit_video_preview;
          response.data.results = [{
            id: 'promo',
            name: 'Video Promocional',
            preview: videoData.preview,
            data: {
              max: videoData.video,
              '480': videoData.video
            }
          }];
        }
      }
    }

    if (!response.data || !response.data.results) {
      throw new Error("Formato de respuesta inválido");
    }

    let mediaItems = [];
    if (type === 'screenshots') {
      mediaItems = response.data.results.map(s => s.image);
    } else {
      mediaItems = response.data.results.map(trailer => {
        const videoData = trailer.data;
        let videoUrl = '';

        // Si tenemos un ID de YouTube, usarlo
        if (trailer.external_id && trailer.external_id.includes('youtube')) {
          videoUrl = `https://www.youtube.com/embed/${trailer.external_id}`;
        } else if (videoData) {
          // Buscar la mejor calidad disponible
          const qualities = ['max', '1080p', '720p', '480p', '360p', '240p'];
          for (const quality of qualities) {
            if (videoData[quality]) {
              videoUrl = videoData[quality];
              break;
            }
          }
        }

        return {
          id: trailer.id,
          name: trailer.name || 'Trailer',
          preview: trailer.preview,
          url: videoUrl || null,
          thumbnail: trailer.preview,
          isYoutube: videoUrl?.includes('youtube.com/embed/')
        };
      }).filter(trailer => trailer.url);
    }

    // Si no hay items, devolver un mensaje específico
    if (mediaItems.length === 0) {
      return res.status(404).json({
        error: type === 'screenshots' 
          ? 'No hay capturas de pantalla disponibles para este juego'
          : 'No hay videos disponibles para este juego'
      });
    }

    // Calcular la paginación
    const totalItems = mediaItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = mediaItems.slice(startIndex, endIndex);

    return res.status(200).json({
      [type]: paginatedItems,
      pages: totalPages,
      currentPage: parseInt(page),
      totalItems
    });

  } catch (error) {
    console.error(`Error al obtener ${type}:`, error);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: `No se encontró contenido multimedia para este juego` 
      });
    }

    return res.status(500).json({ 
      error: `Error al obtener ${type}`,
      details: error.message 
    });
  }
};

module.exports = { create_videogame, get_videogames, get_media };
