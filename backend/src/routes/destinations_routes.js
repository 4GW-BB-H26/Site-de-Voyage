/**
 * Destinations (Oracle destination_tapi) : :id tel que renvoyé par la BD.
 */
import express from "express";
import * as destinationsController from "../controllers/destinations.js";
import { asyncHandler } from "../middleware/error_middleware.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import {
  destinationIdParamValidators,
  postDestinationValidators,
  putDestinationValidators,
} from "../validators/index.js";

const router = express.Router();

router.get(
  "/destinations/:id",
  destinationIdParamValidators,
  handleValidationErrors,
  asyncHandler(destinationsController.getDestination)
);
router.post(
  "/destinations",
  express.json(),
  postDestinationValidators,
  handleValidationErrors,
  asyncHandler(destinationsController.createDestination)
);
router.put(
  "/destinations/:id",
  express.json(),
  putDestinationValidators,
  handleValidationErrors,
  asyncHandler(destinationsController.updateDestination)
);
router.delete(
  "/destinations/:id",
  destinationIdParamValidators,
  handleValidationErrors,
  asyncHandler(destinationsController.deleteDestination)
);

export default router;
