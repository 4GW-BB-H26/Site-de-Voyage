import { Router } from "express";
import {
  addFavorite,
  getFavoritesByUser,
  getFavoriteById,
  updateFavorite,
  removeFavorite,
} from "../controllers/favorites.js";

const router = Router();

router.post("/favorites", addFavorite);
router.get("/favorites/user/:userId", getFavoritesByUser);
router.get("/favorites/:id", getFavoriteById);
router.put("/favorites/:id", updateFavorite);
router.delete("/favorites/:id", removeFavorite);

export default router;
