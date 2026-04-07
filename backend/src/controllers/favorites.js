import { favoritesCollection } from "../models/favorite_model.js";
import { ObjectId } from "mongodb";

function serviceIndisponible(res) {
  return res.status(503).json({
    error:
      "MongoDB non connecte. Verifiez MONGODB_URI, MONGODB_DB_NAME et Docker.",
  });
}

function parseObjectId(id, res) {
  try {
    return new ObjectId(id);
  } catch {
    res.status(400).json({ error: "Identifiant MongoDB invalide." });
    return null;
  }
}

export async function addFavorite(req, res) {
  const coll = favoritesCollection();
  if (!coll) return serviceIndisponible(res);

  const { userId, destinationId, nomDestination } = req.body || {};
  const uid = userId != null ? String(userId).trim() : "";
  const did = destinationId != null ? String(destinationId).trim() : "";
  const nom = nomDestination != null ? String(nomDestination).trim() : "";

  if (!uid || !did || !nom) {
    return res.status(400).json({
      error: "Champs requis : userId, destinationId, nomDestination.",
    });
  }

  try {
    const existing = await coll.findOne({ userId: uid, destinationId: did });
    if (existing) {
      return res.status(200).json(existing);
    }

    const doc = {
      userId: uid,
      destinationId: did,
      nomDestination: nom,
      dateAjout: new Date(),
    };
    const result = await coll.insertOne(doc);
    return res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getFavoritesByUser(req, res) {
  const coll = favoritesCollection();
  if (!coll) return serviceIndisponible(res);

  try {
    const userId = String(req.params.userId);
    const favorites = await coll.find({ userId }).toArray();
    return res.json(favorites);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getFavoriteById(req, res) {
  const coll = favoritesCollection();
  if (!coll) return serviceIndisponible(res);

  const oid = parseObjectId(req.params.id, res);
  if (!oid) return;

  try {
    const doc = await coll.findOne({ _id: oid });
    if (!doc) {
      return res.status(404).json({ error: "Favori introuvable." });
    }
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateFavorite(req, res) {
  const coll = favoritesCollection();
  if (!coll) return serviceIndisponible(res);

  const oid = parseObjectId(req.params.id, res);
  if (!oid) return;

  const { nomDestination, destinationId } = req.body || {};
  const set = {};
  if (nomDestination != null && String(nomDestination).trim() !== "") {
    set.nomDestination = String(nomDestination).trim();
  }
  if (destinationId != null && String(destinationId).trim() !== "") {
    set.destinationId = String(destinationId).trim();
  }

  if (Object.keys(set).length === 0) {
    return res.status(400).json({
      error: "Fournir au moins nomDestination ou destinationId.",
    });
  }

  try {
    const result = await coll.updateOne({ _id: oid }, { $set: set });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Favori introuvable." });
    }
    const doc = await coll.findOne({ _id: oid });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function removeFavorite(req, res) {
  const coll = favoritesCollection();
  if (!coll) return serviceIndisponible(res);

  const oid = parseObjectId(req.params.id, res);
  if (!oid) return;

  try {
    const result = await coll.deleteOne({ _id: oid });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Favori introuvable." });
    }
    return res.json({ message: "Favori supprime" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
