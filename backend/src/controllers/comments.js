//Gère les actions pour comments

import { commentsCollection } from "../models/comment_model.js";
import { ObjectId } from "mongodb";

// post commentaire
export async function addComment(req, res) {
  try {
    const { destinationId, auteur, texte } = req.body; 
    const collection = commentsCollection();
    
    if (!collection) throw new Error("Base de données non connectée");
    const nouveauCommentaire = {
      destinationId: destinationId || "support",
      userName: auteur || "Anonyme",
      comment: texte,
      date: new Date()
    };

    const result = await collection.insertOne(nouveauCommentaire);
    res.status(201).json({ success: true, data: { ...nouveauCommentaire, _id: result.insertedId } });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
  }
}

// Get commentaire avec destination
export async function getCommentsByDestination(req, res) {
  try {
    const { destId } = req.params;
    const collection = commentsCollection();
    
    // Cherche eet tri tout les commentaires du meme ID
    const commentaires = await collection.find({ destinationId: destId }).sort({ date: -1 }).toArray();
    res.json({ success: true, data: commentaires });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
  }
}

// Get commentaire avec ID
export async function getCommentById(req, res) {
  try {
    const collection = commentsCollection();
    const commentaire = await collection.findOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, data: commentaire });
  } catch (error) {
    res.status(500).json({ error: "Erreur" });
  }
}

//  Upd commentaire
export async function updateComment(req, res) {
  try {
    const collection = commentsCollection();
    await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur" });
  }
}

// Delete commentaire
export async function removeComment(req, res) {
  try {
    const collection = commentsCollection();
    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur" });
  }
}