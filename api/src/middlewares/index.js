const validatorMiddleware = require("./validatorMiddleware");

// Cache simple en memoria
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

const cacheMiddleware = (duration = CACHE_DURATION) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      const { data, timestamp } = cachedResponse;
      if (Date.now() - timestamp < duration) {
        return res.json(data);
      } else {
        cache.delete(key);
      }
    }

    // Modificamos el método json de res para interceptar y cachear la respuesta
    const originalJson = res.json;
    res.json = function(data) {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      return originalJson.call(this, data);
    };

    next();
  };
};

// Limpieza periódica del caché
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);

module.exports = {
  validatorMiddleware,
  cacheMiddleware
};
