const {
  get_allVideogames,
  get_videogame_byName,
  get_videogame_detail,
  get_upcoming_games_api,
  get_recent_games_api
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
        let isYoutube = false;

        // Primero intentamos obtener el ID de YouTube
        if (trailer.external_id && trailer.external_id.includes('youtube')) {
          const youtubeId = trailer.external_id.replace('youtube-', '');
          videoUrl = `https://www.youtube.com/embed/${youtubeId}`;
          isYoutube = true;
        } 
        // Luego intentamos procesar una URL de YouTube del preview
        else if (trailer.preview && trailer.preview.includes('youtube')) {
          const youtubeMatch = trailer.preview.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          if (youtubeMatch) {
            videoUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
            isYoutube = true;
          }
        }
        // Si no es YouTube, buscamos la mejor calidad de video directa
        else if (videoData) {
          const qualities = ['max', '1080p', '720p', '480p', '360p', '240p'];
          for (const quality of qualities) {
            if (videoData[quality]) {
              videoUrl = videoData[quality];
              break;
            }
          }

          // Si no encontramos calidad estándar, usar cualquier URL disponible
          if (!videoUrl) {
            const availableQualities = Object.keys(videoData);
            if (availableQualities.length > 0) {
              videoUrl = videoData[availableQualities[0]];
            }
          }
        }

        // Si aún no tenemos URL y hay una preview que parece ser un video
        if (!videoUrl && trailer.preview && (
          trailer.preview.endsWith('.mp4') || 
          trailer.preview.includes('/videos/') ||
          trailer.preview.includes('cloudinary')
        )) {
          videoUrl = trailer.preview;
        }

        return {
          id: trailer.id,
          name: trailer.name || 'Trailer',
          preview: trailer.preview,
          url: videoUrl || null,
          thumbnail: trailer.preview,
          isYoutube: isYoutube
        };
      }).filter(trailer => trailer.url);
    }

    // Si no hay items, devolver un mensaje específico
    if (mediaItems.length === 0) {
      return res.status(404).json({
        [type]: [],
        error: type === 'screenshots' 
          ? 'No hay capturas de pantalla disponibles para este juego'
          : 'No hay videos disponibles para este juego',
        pages: 0,
        currentPage: 1,
        totalItems: 0
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
        [type]: [],
        error: `No se encontró contenido multimedia para este juego`,
        pages: 0,
        currentPage: 1,
        totalItems: 0
      });
    }

    return res.status(500).json({ 
      [type]: [],
      error: `Error al obtener ${type}`,
      details: error.message,
      pages: 0,
      currentPage: 1,
      totalItems: 0
    });
  }
};

const get_upcoming_games = async (req, res) => {
  try {
    const upcomingGames = await get_upcoming_games_api();
    if (!upcomingGames || upcomingGames.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron próximos lanzamientos" 
      });
    }
    return res.status(200).json(upcomingGames);
  } catch (error) {
    console.error("Error en get_upcoming_games:", error);
    
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

    return res.status(500).json({ 
      error: "Error interno del servidor al obtener los próximos lanzamientos",
      details: error.message 
    });
  }
};

const get_recent_games = async (req, res) => {
  try {
    const recentGames = await get_recent_games_api();
    if (!recentGames || recentGames.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron lanzamientos recientes" 
      });
    }
    return res.status(200).json(recentGames);
  } catch (error) {
    console.error("Error en get_recent_games:", error);
    
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

    return res.status(500).json({ 
      error: "Error interno del servidor al obtener los lanzamientos recientes",
      details: error.message 
    });
  }
};

module.exports = {
  get_videogames,
  get_media,
  get_upcoming_games,
  get_recent_games,
};
