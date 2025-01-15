const server = require("./src/app.js");
const { conn, syncDatabase } = require("./src/db.js");
const port = process.env.PORT || 3001;

// Sincronizar la base de datos y luego iniciar el servidor
const startServer = async () => {
  try {
    // Forzar la sincronización de la base de datos para crear las nuevas columnas
    await syncDatabase(true);
    
    server.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
