//startup du backend (lorsque on run npm start)

import "./config/loadEnv.js";
import app from "./app.js";
import { port } from "./config/config.js";
import { connectToMongo } from "./db/mongo.js";
import { createServer } from "node:http";

// Connexion Mongo
const mongoOk = await connectToMongo(
  process.env.MONGODB_URI,
  process.env.MONGODB_DB_NAME,
);

const server = createServer(app);

server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    console.error(
      `Le port ${port} est déjà pris — sans doute une autre instance de l’API. ` +
        `Ferme l’autre terminal ou change PORT dans backend/.env.`,
    );
    process.exit(1);
  }
  console.error("Quelque chose a bloqué au démarrage du serveur :", err);
  process.exit(1);
});

server.listen(port, () => {
  console.log(`API prête sur http://localhost:${port}`);
});
