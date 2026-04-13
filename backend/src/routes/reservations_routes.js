import express from "express";
import * as reservationsController from "../controllers/reservations.js";
import {
  exigerJetonValide,
  exigerRessourceUtilisateur,
  exigerUtilisateurCorps,
} from "../middleware/auth_jwt_middleware.js";
import { asyncHandler } from "../middleware/error_middleware.js";

const router = express.Router();

router.get(
  "/reservations/user/:userId",
  exigerJetonValide,
  exigerRessourceUtilisateur("userId"),
  asyncHandler(reservationsController.listReservationsByUser)
);
router.get(
  "/reservations/:id",
  asyncHandler(reservationsController.getReservation)
);
router.post(
  "/reservations",
  express.json(),
  exigerJetonValide,
  exigerUtilisateurCorps("users_id_users"),
  asyncHandler(reservationsController.createReservation)
);
router.put(
  "/reservations/:id/cancel",
  asyncHandler(reservationsController.cancelReservation)
);
router.delete(
  "/reservations/:id",
  asyncHandler(reservationsController.deleteReservation)
);

export default router;
