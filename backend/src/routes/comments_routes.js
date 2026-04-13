import { Router } from "express";
import {
  addComment,
  getCommentsByDestination,
  getCommentById,
  updateComment,
  removeComment,
} from "../controllers/comments.js";
import { asyncHandler } from "../middleware/error_middleware.js";

const router = Router();

router.post("/comments", asyncHandler(addComment));
router.get(
  "/comments/destination/:destId",
  asyncHandler(getCommentsByDestination)
);
router.get("/comments/:id", asyncHandler(getCommentById));
router.put("/comments/:id", asyncHandler(updateComment));
router.delete("/comments/:id", asyncHandler(removeComment));

export default router;
