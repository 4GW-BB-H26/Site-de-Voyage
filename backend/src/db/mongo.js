/**
 * Client MongoDB partagé : une seule connexion pour favoris, commentaires et auth mongo.
 */
import { MongoClient } from "mongodb";

let client;
let db;

/** @returns {Promise<boolean>} oui si on a bien une base exploitable */
export async function connectToMongo(uri, dbName) {
  if (!uri || !dbName) {
    console.warn(
      "MongoDB : MONGODB_URI ou MONGODB_DB_NAME manquant — favoris, commentaires et auth Mongo ne pourront pas tourner."
    );
    return false;
  }
  client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connexion MongoDB OK (base voyage)");
    return true;
  } catch (err) {
    console.error("Connexion MongoDB impossible :", err);
    db = undefined;
    client = undefined;
    return false;
  }
}

/** Instance de base utilisée par les collections ; undefined si la connexion a échoué */
export function getDb() {
  return db;
}
