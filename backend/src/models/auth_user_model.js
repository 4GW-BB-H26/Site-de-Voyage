/**
 * Accès à la collection Mongo des comptes (mode AUTH_MODE=mongo uniquement).
 */
import { getDb } from "../db/mongo.js";

/** Retourne la collection ou null si Mongo n’est pas connecté */
export function authUsersCollection() {
  const database = getDb();
  return database ? database.collection("utilisateurs_auth") : null;
}
