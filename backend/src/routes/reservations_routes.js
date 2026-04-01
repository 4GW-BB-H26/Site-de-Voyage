import express from "express";
import * as reservationsController from "../controllers/reservations.js";

const router = express.Router();

router.get("/reservations/user/:userId", reservationsController.listReservationsByUser);
router.get("/reservations/:id", reservationsController.getReservation);
router.post("/reservations", express.json(), reservationsController.createReservation);
router.put("/reservations/:id/cancel", reservationsController.cancelReservation);
router.delete("/reservations/:id", reservationsController.deleteReservation);

export default router;
