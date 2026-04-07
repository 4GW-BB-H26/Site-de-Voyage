import { commentsCollection } from "../models/comment_model.js";
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

export async function addComment(req, res) {
  const coll = commentsCollection();
  if (!coll) return serviceIndisponible(res);

  const { destinationId, auteur, texte, note } = req.body || {};
  const dest = destinationId != null ? String(destinationId).trim() : "";
  const auth = auteur != null ? String(auteur).trim() : "";
  const txt = texte != null ? String(texte).trim() : "";

  if (!dest || !auth || !txt) {
    return res.status(400).json({
      error: "Champs requis : destinationId, auteur, texte.",
    });
  }

  let noteNum = note;
  if (noteNum != null) {
    noteNum = Number(noteNum);
    if (Number.isNaN(noteNum) || noteNum < 1 || noteNum > 5) {
      return res.status(400).json({ error: "note entre 1 et 5." });
    }
  }

  try {
    const comment = {
      destinationId: dest,
      auteur: auth,
      texte: txt,
      ...(noteNum != null ? { note: noteNum } : {}),
      date: new Date(),
    };
    const result = await coll.insertOne(comment);
    return res.status(201).json({ _id: result.insertedId, ...comment });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getCommentsByDestination(req, res) {
  const coll = commentsCollection();
  if (!coll) return serviceIndisponible(res);

  try {
    const destId = String(req.params.destId);
    const comments = await coll.find({ destinationId: destId }).toArray();
    return res.json(comments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getCommentById(req, res) {
  const coll = commentsCollection();
  if (!coll) return serviceIndisponible(res);

  const oid = parseObjectId(req.params.id, res);
  if (!oid) return;

  try {
    const doc = await coll.findOne({ _id: oid });
    if (!doc) {
      return res.status(404).json({ error: "Commentaire introuvable." });
    }
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateComment(req, res) {
  const coll = commentsCollection();
  if (!coll) return serviceIndisponible(res);

  const oid = parseObjectId(req.params.id, res);
  if (!oid) return;

  const { auteur, texte, note } = req.body || {};
  const set = {};

  if (auteur != null) {
    const a = String(auteur).trim();
    if (!a) {
      return res.status(400).json({ error: "auteur non vide requis." });
    }
    set.auteur = a;
  }
  if (texte != null) {
    const t = String(texte).trim();
    if (!t) {
      return res.status(400).json({ error: "texte non vide requis." });
    }
    set.texte = t;
  }
  if (note !== undefined) {
    const n = Number(note);
    if (Number.isNaN(n) || n < 1 || n > 5) {
      return res.status(400).json({ error: "note entre 1 et 5." });
    }
    set.note = n;
  }

  if (Object.keys(set).length === 0) {
    return res.status(400).json({
      error: "Fournir auteur, texte ou note.",
    });
  }

  set.date = new Date();

  try {
    const result = await coll.updateOne({ _id: oid }, { $set: set });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Commentaire introuvable." });
    }
    const doc = await coll.findOne({ _id: oid });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function removeComment(req, res) {
  const coll = commentsCollection();
  if (!coll) return serviceIndisponible(res);

  const oid = parseObjectId(req.params.id, res);
  if (!oid) return;

  try {
    const result = await coll.deleteOne({ _id: oid });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Commentaire introuvable." });
    }
    return res.json({ message: "Commentaire supprime" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
