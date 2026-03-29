// test inspiré de lab3

import { config } from "dotenv";
import { connectToMongo, getDb } from "./db/mongo.js";
import { ObjectId } from "mongodb";

config();

async function runTravelTests() {
    await connectToMongo(process.env.MONGODB_URI, process.env.MONGODB_DB_NAME);
    const db = getDb();
    const favorites = db.collection("favoris");
    const comments = db.collection("commentaires");

    console.log("=== TEST FAVORIS ===");
    const favResult = await favorites.insertMany([
        { userId: "zidane_01", destinationId: "uzbekistan_88", nom: "uzbekistan hotel" },
        { userId: "zidane_01", destinationId: "zimbabwe_99", nom: "zimbabwe trip" }
    ]);
    
    let allFavs = await favorites.find({ userId: "zidane_01" }).toArray();
    console.log(allFavs);

    console.log("\n=== TEST COMMENTAIRES ===");
    await comments.insertOne({
        destinationId: "uzbekistan_88",
        auteur: "zidane",
        texte: "Incroyable voyage !",
        date: new Date()
    });

    let destComments = await comments.find({ destinationId: "uzbekistan_88" }).toArray();
    console.log(destComments);

    console.log("\n=== NETTOYAGE ===");
    await favorites.deleteOne({ _id: allFavs[0]._id });
    await comments.deleteMany({ destinationId: "uzbekistan_88" });

    const finalFavs = await favorites.find().toArray();
    console.log("Favoris restants :", finalFavs);
}

runTravelTests();