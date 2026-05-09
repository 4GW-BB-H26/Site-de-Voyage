import { getDb } from "../db/mongo.js";

//modele mongo pour les favoris

export function favoritesCollection() {
  const database = getDb();
  return database ? database.collection("favoris") : null;
}
