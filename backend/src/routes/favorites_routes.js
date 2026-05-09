//Les routes API pour les favoris

import { Router } from "express";
import {
  addFavorite,
  getFavoritesByUser,
  getFavoriteById,
  updateFavorite,
  removeFavorite,
} from "../controllers/favorites.js";
import { asyncHandler } from "../middleware/error_middleware.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import {
  postFavoriteValidators,
  mongoIdParamValidators,
  favoriteUpdateValidators,
  favoritesUserIdParamValidators,
} from "../validators/index.js";

const router = Router();

router.post(
  "/favorites", // création (ou renvoie l’existant si doublon user+dest)
  postFavoriteValidators,
  handleValidationErrors,
  asyncHandler(addFavorite),
);
router.get(
  "/favorites/user/:userId",
  favoritesUserIdParamValidators,
  handleValidationErrors,
  asyncHandler(getFavoritesByUser),
);
router.get(
  "/favorites/:id",
  mongoIdParamValidators,
  handleValidationErrors,
  asyncHandler(getFavoriteById),
);
router.put(
  "/favorites/:id",
  favoriteUpdateValidators,
  handleValidationErrors,
  asyncHandler(updateFavorite),
);
router.delete(
  "/favorites/:id",
  mongoIdParamValidators,
  handleValidationErrors,
  asyncHandler(removeFavorite),
);

export default router;
