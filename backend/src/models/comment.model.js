import { getDb } from "../db/mongo.js";

export function commentsCollection() {
    return getDb().collection("commentaires");
}