import { commentsCollection } from "../models/comment.model.js";

export async function addComment(req, res) {
    try {
        const comment = { ...req.body, date: new Date() };
        const result = await commentsCollection().insertOne(comment);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getCommentsByDestination(req, res) {
    try {
        const comments = await commentsCollection().find({ destinationId: req.params.destId }).toArray();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}