import { Router } from "express";
import {
  addComment,
  getCommentsByDestination,
  getCommentById,
  updateComment,
  removeComment,
} from "../controllers/comments.js";

const router = Router();

router.post("/comments", addComment);
router.get("/comments/destination/:destId", getCommentsByDestination);
router.get("/comments/:id", getCommentById);
router.put("/comments/:id", updateComment);
router.delete("/comments/:id", removeComment);

export default router;
