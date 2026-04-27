/**
 * Routes utilisateur / auth : validateurs express-validator puis contrôleurs.
 * Ordre typique : validation → handleValidationErrors → JWT si besoin → handler.
 */
import express from "express";
import * as usersController from "../controllers/users.js";
import {
  exigerJetonValide,
  exigerRessourceUtilisateur,
} from "../middleware/auth_jwt_middleware.js";
import { asyncHandler } from "../middleware/error_middleware.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import {
  authorizationBearerValidators,
  getUserQueryValidators,
  postAuthLoginValidators,
  postUsersValidators,
  putUserValidators,
  deleteUserValidators,
} from "../validators/index.js";

const router = express.Router();

// Connexion (query) — peu utilisé si le front passe par POST /auth/login
router.get(
  "/user",
  getUserQueryValidators,
  handleValidationErrors,
  asyncHandler(usersController.getUser)
);
// Connexion JSON (principal pour React)
router.post(
  "/auth/login",
  express.json(),
  postAuthLoginValidators,
  handleValidationErrors,
  asyncHandler(usersController.postAuthLogin)
);
// Profil depuis le jeton
router.get(
  "/auth/me",
  authorizationBearerValidators,
  handleValidationErrors,
  exigerJetonValide,
  asyncHandler(usersController.getAuthMe)
);
// Inscription
router.post(
  "/users",
  express.json(),
  postUsersValidators,
  handleValidationErrors,
  asyncHandler(usersController.createUser)
);
// Mise à jour compte (JWT + même id que dans l’URL)
router.put(
  "/users/:id",
  express.json(),
  putUserValidators,
  authorizationBearerValidators,
  handleValidationErrors,
  exigerJetonValide,
  exigerRessourceUtilisateur("id"),
  asyncHandler(usersController.updateUser)
);
// Suppression compte
router.delete(
  "/users/:id",
  deleteUserValidators,
  authorizationBearerValidators,
  handleValidationErrors,
  exigerJetonValide,
  exigerRessourceUtilisateur("id"),
  asyncHandler(usersController.deleteUser)
);

export default router;
