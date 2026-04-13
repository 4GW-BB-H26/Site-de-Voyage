import { Router } from "express";
import {
  addFavorite,
  getFavoritesByUser,
  getFavoriteById,
  updateFavorite,
  removeFavorite,
} from "../controllers/favorites.js";
import { asyncHandler } from "../middleware/error_middleware.js";

const router = Router();

router.post("/favorites", asyncHandler(addFavorite));
router.get("/favorites/user/:userId", asyncHandler(getFavoritesByUser));
router.get("/favorites/:id", asyncHandler(getFavoriteById));
router.put("/favorites/:id", asyncHandler(updateFavorite));
router.delete("/favorites/:id", asyncHandler(removeFavorite));

export default router;
