/**
 * Packages voyage (Oracle via package_tapi) : param :id = identifiant numérique.
 */
import express from "express";
import * as packagesController from "../controllers/packages.js";
import { asyncHandler } from "../middleware/error_middleware.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import {
  packageIdParamValidators,
  postPackageValidators,
  putPackageValidators,
} from "../validators/index.js";

const router = express.Router();

router.get(
  "/packages/:id",
  packageIdParamValidators,
  handleValidationErrors,
  asyncHandler(packagesController.getPackageById)
);
router.post(
  "/packages",
  express.json(),
  postPackageValidators,
  handleValidationErrors,
  asyncHandler(packagesController.createPackage)
);
router.put(
  "/packages/:id",
  express.json(),
  putPackageValidators,
  handleValidationErrors,
  asyncHandler(packagesController.updatePackage)
);
router.delete(
  "/packages/:id",
  packageIdParamValidators,
  handleValidationErrors,
  asyncHandler(packagesController.deletePackage)
);

export default router;
