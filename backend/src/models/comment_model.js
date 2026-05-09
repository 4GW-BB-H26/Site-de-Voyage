import { getDb } from "../db/mongo.js";

//modele mongo pour les commentaires

export function commentsCollection() {
  const database = getDb();
  return database ? database.collection("commentaires") : null;
}
