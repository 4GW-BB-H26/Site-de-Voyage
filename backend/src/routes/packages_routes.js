import express from "express";
import * as packagesController from "../controllers/packages.js";

const router = express.Router();

router.get("/packages/:id", packagesController.getPackageById);
router.post("/packages", express.json(), packagesController.createPackage);
router.put("/packages/:id", express.json(), packagesController.updatePackage);
router.delete("/packages/:id", packagesController.deletePackage);

export default router;
