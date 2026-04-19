import { MongoClient } from "mongodb";

let client;
let db;

export async function connectToMongo(uri, dbName) {
  if (!uri || !dbName) {
    console.warn(
      "MongoDB: MONGODB_URI ou MONGODB_DB_NAME manquant, routes NoSQL indisponibles."
    );
    return;
  }
  client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB Voyage connecte");
  } catch (err) {
    console.error("Erreur MongoDB:", err);
    db = undefined;
    client = undefined;
  }
}

export function getDb() {
  return db;
}
