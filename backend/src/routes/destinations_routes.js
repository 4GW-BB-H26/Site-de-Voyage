import express from "express";
import * as destinationsController from "../controllers/destinations.js";

const router = express.Router();

router.get("/destinations/:id", destinationsController.getDestination);
router.post("/destinations", express.json(), destinationsController.createDestination);
router.put("/destinations/:id", express.json(), destinationsController.updateDestination);
router.delete("/destinations/:id", destinationsController.deleteDestination);

export default router;
