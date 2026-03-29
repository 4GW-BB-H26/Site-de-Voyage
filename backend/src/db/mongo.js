import { MongoClient } from "mongodb";

let client;
let db;

export async function connectToMongo(uri, dbName) {
    client = new MongoClient(uri);
    try {
        await client.connect();
        db = client.db(dbName);
        console.log("MongoDB Voyage connecté");
    } catch (err) {
        console.error("Erreur MongoDB:", err);
    }
}

export function getDb() {
    return db;
}