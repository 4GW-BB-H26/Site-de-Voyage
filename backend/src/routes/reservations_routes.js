/**
 * Réservations Oracle : lecture souvent protégée par JWT, création alignée sur le corps.
 */
import express from "express";
import * as reservationsController from "../controllers/reservations.js";
import {
  exigerJetonValide,
  exigerRessourceUtilisateur,
  exigerUtilisateurCorps,
} from "../middleware/auth_jwt_middleware.js";
import { asyncHandler } from "../middleware/error_middleware.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import {
  authorizationBearerValidators,
  reservationUserIdParamValidators,
  reservationIdParamValidators,
  postReservationValidators,
} from "../validators/index.js";

const router = express.Router();

// Liste des résas d’un utilisateur : le :userId doit matcher le JWT
router.get(
  "/reservations/user/:userId",
  authorizationBearerValidators,
  reservationUserIdParamValidators,
  handleValidationErrors,
  exigerJetonValide,
  exigerRessourceUtilisateur("userId"),
  asyncHandler(reservationsController.listReservationsByUser)
);
// Détail d’une réservation
router.get(
  "/reservations/:id",
  reservationIdParamValidators,
  handleValidationErrors,
  asyncHandler(reservationsController.getReservation)
);
// Création : corps validé + JWT + cohérence users_id_users
router.post(
  "/reservations",
  express.json(),
  postReservationValidators,
  authorizationBearerValidators,
  handleValidationErrors,
  exigerJetonValide,
  exigerUtilisateurCorps("users_id_users"),
  asyncHandler(reservationsController.createReservation)
);
// Annulation (statut)
router.put(
  "/reservations/:id/cancel",
  reservationIdParamValidators,
  handleValidationErrors,
  asyncHandler(reservationsController.cancelReservation)
);
// Suppression ligne réservation
router.delete(
  "/reservations/:id",
  reservationIdParamValidators,
  handleValidationErrors,
  asyncHandler(reservationsController.deleteReservation)
);

export default router;
