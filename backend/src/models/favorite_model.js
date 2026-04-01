import { getDb } from "../db/mongo.js";

export function favoritesCollection() {
    return getDb().collection("favoris");
}