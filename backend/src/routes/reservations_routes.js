//Les route api pour les reservations

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

// Liste des réservations d’un utilisateur : le :userId doit matcher le JWT
router.get(
  "/reservations/user/:userId",
  authorizationBearerValidators,
  reservationUserIdParamValidators,
  handleValidationErrors,
  exigerJetonValide,
  exigerRessourceUtilisateur("userId"),
  asyncHandler(reservationsController.listReservationsByUser),
);
// Détail d’une réservation
router.get(
  "/reservations/:id",
  authorizationBearerValidators,
  reservationIdParamValidators,
  handleValidationErrors,
  exigerJetonValide,
  asyncHandler(reservationsController.getReservation),
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
  asyncHandler(reservationsController.createReservation),
);
// Annulation (statut)
router.put(
  "/reservations/:id/cancel",
  authorizationBearerValidators,
  reservationIdParamValidators,
  handleValidationErrors,
  exigerJetonValide,
  asyncHandler(reservationsController.cancelReservation),
);
// Suppression ligne réservation
router.delete(
  "/reservations/:id",
  authorizationBearerValidators,
  reservationIdParamValidators,
  handleValidationErrors,
  exigerJetonValide,
  asyncHandler(reservationsController.deleteReservation),
);

export default router;
