//script pour creer les tables sur mongo

import { MongoClient } from "mongodb";

let client;
let db;

async function creerIndexesMongo(database) {
  try {
    const favoris = database.collection("favoris");
    await favoris.createIndex(
      { userId: 1, destinationId: 1 },
      { unique: true, name: "uniq_user_destination" },
    );

    const commentaires = database.collection("commentaires");
    await commentaires.createIndex(
      { destinationId: 1, date: -1 },
      { name: "destination_date_desc" },
    );
  } catch (err) {
    console.warn("MongoDB: index non créé.", err.message);
  }
}
export async function connectToMongo(uri, dbName) {
  if (!uri || !dbName) {
    console.warn(
      "MongoDB : MONGODB_URI ou MONGODB_DB_NAME manquant — favoris, commentaires et auth Mongo ne pourront pas tourner.",
    );
    return false;
  }
  client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db(dbName);
    await creerIndexesMongo(db);
    console.log("Connexion MongoDB OK (base voyage)");
    return true;
  } catch (err) {
    console.error("Connexion MongoDB impossible :", err);
    db = undefined;
    client = undefined;
    return false;
  }
}

export function getDb() {
  return db;
}
