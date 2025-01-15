const validatorMiddleware = (req, res, next) => {
  const { 
    name, 
    description, 
    platforms,
    trailers,
    screenshots,
    website
  } = req.body;

  if (!name) return res.status(400).json({ error: "Missing Name" });
  if (!description) return res.status(400).json({ error: "Missing description" });
  if (!platforms || !platforms.length) return res.status(400).json({ error: "Missing Platforms" });
  
  // Validación de URLs
  if (website && !isValidUrl(website)) {
    return res.status(400).json({ error: "Invalid website URL" });
  }

  if (screenshots) {
    for (const screenshot of screenshots) {
      if (!isValidUrl(screenshot)) {
        return res.status(400).json({ error: "Invalid screenshot URL" });
      }
    }
  }

  if (trailers) {
    for (const trailer of trailers) {
      if (!isValidUrl(trailer.url)) {
        return res.status(400).json({ error: "Invalid trailer URL" });
      }
    }
  }

  next();
};

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = validatorMiddleware; 
