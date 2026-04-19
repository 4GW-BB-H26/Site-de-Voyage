/**
 * @fileoverview Charge le fichier backend/.env avec un chemin absolu.
 * À importer en premier dans server.js pour que ORACLE_*, AUTH_MODE, etc. existent
 * avant le reste de l’application.
 */
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../.env");

const result = dotenv.config({ path: envPath });

if (result.error && process.env.NODE_ENV !== "test") {
  console.warn(
    `[loadEnv] Impossible de lire le fichier .env (${envPath}) : ${result.error.message}. ` +
      "Les valeurs par défaut ou les variables système seront utilisées."
  );
}
