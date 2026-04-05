import express from "express";
import * as reservationsController from "../controllers/reservations.js";
import {
  exigerJetonValide,
  exigerRessourceUtilisateur,
  exigerUtilisateurCorps,
} from "../middleware/auth_jwt_middleware.js";

const router = express.Router();

router.get(
  "/reservations/user/:userId",
  exigerJetonValide,
  exigerRessourceUtilisateur("userId"),
  reservationsController.listReservationsByUser
);
router.get("/reservations/:id", reservationsController.getReservation);
router.post(
  "/reservations",
  express.json(),
  exigerJetonValide,
  exigerUtilisateurCorps("users_id_users"),
  reservationsController.createReservation
);
router.put("/reservations/:id/cancel", reservationsController.cancelReservation);
router.delete("/reservations/:id", reservationsController.deleteReservation);

export default router;
