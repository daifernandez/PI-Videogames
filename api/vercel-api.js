// Entrypoint para Vercel Serverless: exporta la app Express sin listen().
// En Vercel cada request invoca esta función; index.js (con listen) es para servidor tradicional.
module.exports = require("./src/app.js");
