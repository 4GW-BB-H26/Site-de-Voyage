import { Router } from "express";
import { addComment, getCommentsByDestination } from "../controllers/comments.controller.js";

const router = Router();

router.post("/comments", addComment);
router.get("/comments/destination/:destId", getCommentsByDestination);

export default router;