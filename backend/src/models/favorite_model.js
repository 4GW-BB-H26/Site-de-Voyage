import { getDb } from "../db/mongo.js";

export function favoritesCollection() {
  const database = getDb();
  return database ? database.collection("favoris") : null;
}
