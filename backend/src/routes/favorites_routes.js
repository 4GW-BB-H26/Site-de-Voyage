import { Router } from "express";
import { addFavorite, getFavoritesByUser, removeFavorite } from "../controllers/favorites.js";

const router = Router();

router.post("/favorites", addFavorite);
router.get("/favorites/user/:userId", getFavoritesByUser);
router.delete("/favorites/:id", removeFavorite);

export default router;