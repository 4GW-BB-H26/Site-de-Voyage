import { getDb } from "../db/mongo.js";

export function commentsCollection() {
  const database = getDb();
  return database ? database.collection("commentaires") : null;
}
