const validatorMiddleware = (req, res, next) => {
  const { name, description, platforms } = req.body;
  if (!name) return res.status(400).json({ error: "Missing Name" });
  if (!description)
    return res.status(400).json({ error: "Missing description" });
  if (!platforms.length)
    return res.status(400).json({ error: "Missing Platforms" });
  next();
};

module.exports = { validatorMiddleware };
