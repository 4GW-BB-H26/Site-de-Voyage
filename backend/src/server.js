import "dotenv/config";
import app from "./app.js";
import { port } from "./config/config.js";
import { connectToMongo } from "./db/mongo.js";
import { createServer } from "node:http";

await connectToMongo(process.env.MONGODB_URI, process.env.MONGODB_DB_NAME);

const server = createServer(app);

server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    console.error(
      `Le port ${port} est deja utilise. Fermez l'autre processus ou changez PORT dans backend/.env.`
    );
    process.exit(1);
  }
  console.error("Erreur serveur au demarrage:", err);
  process.exit(1);
});

server.listen(port, () => {
  console.log(`API demarree sur http://localhost:${port}`);
});
