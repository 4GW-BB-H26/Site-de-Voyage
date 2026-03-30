import { favoritesCollection } from "../models/favorite.model.js";
import { ObjectId } from "mongodb";

export async function addFavorite(req, res) {
    try {
        const result = await favoritesCollection().insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getFavoritesByUser(req, res) {
    try {
        const favorites = await favoritesCollection().find({ userId: req.params.userId }).toArray();
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function removeFavorite(req, res) {
    try {
        const result = await favoritesCollection().deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Favori supprimé" });
    } catch (err) {
        res.status(400).json({ error: "ID invalide" });
    }
}