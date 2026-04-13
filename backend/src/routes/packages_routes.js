import express from "express";
import * as packagesController from "../controllers/packages.js";
import { asyncHandler } from "../middleware/error_middleware.js";

const router = express.Router();

router.get("/packages/:id", asyncHandler(packagesController.getPackageById));
router.post(
  "/packages",
  express.json(),
  asyncHandler(packagesController.createPackage)
);
router.put(
  "/packages/:id",
  express.json(),
  asyncHandler(packagesController.updatePackage)
);
router.delete("/packages/:id", asyncHandler(packagesController.deletePackage));

export default router;
