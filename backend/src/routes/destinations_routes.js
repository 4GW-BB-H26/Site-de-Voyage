import express from "express";
import * as destinationsController from "../controllers/destinations.js";
import { asyncHandler } from "../middleware/error_middleware.js";

const router = express.Router();

router.get("/destinations/:id", asyncHandler(destinationsController.getDestination));
router.post(
  "/destinations",
  express.json(),
  asyncHandler(destinationsController.createDestination)
);
router.put(
  "/destinations/:id",
  express.json(),
  asyncHandler(destinationsController.updateDestination)
);
router.delete(
  "/destinations/:id",
  asyncHandler(destinationsController.deleteDestination)
);

export default router;
