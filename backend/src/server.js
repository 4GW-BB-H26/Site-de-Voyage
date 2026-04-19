/**
 * Démarre l’API HTTP : variables d’environnement, Mongo, puis écoute sur PORT.
 * Si AUTH_MODE=mongo, Mongo doit être joignable sinon on arrête tout de suite.
 */
import "./config/loadEnv.js";
import app from "./app.js";
import { port } from "./config/config.js";
import { useMongoAuth } from "./config/auth.js";
import { connectToMongo } from "./db/mongo.js";
import { createServer } from "node:http";

// Connexion Mongo (favoris, commentaires, et comptes si AUTH_MODE=mongo)
const mongoOk = await connectToMongo(
  process.env.MONGODB_URI,
  process.env.MONGODB_DB_NAME
);

if (useMongoAuth && !mongoOk) {
  console.error(
    "\nImpossible de démarrer : tu as choisi AUTH_MODE=mongo mais MongoDB ne répond pas.\n" +
      "  → Lance Mongo (Docker, service local, etc.) et vérifie MONGODB_URI.\n" +
      "  → Ou remets AUTH_MODE=oracle dans backend/.env si ton Oracle est prêt.\n"
  );
  process.exit(1);
}

const server = createServer(app);

server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    console.error(
      `Le port ${port} est déjà pris — sans doute une autre instance de l’API. ` +
        `Ferme l’autre terminal ou change PORT dans backend/.env.`
    );
    process.exit(1);
  }
  console.error("Quelque chose a bloqué au démarrage du serveur :", err);
  process.exit(1);
});

server.listen(port, () => {
  console.log(`API prête sur http://localhost:${port}`);
});
