import express from "express";
import { getAccueil } from "../controllers/accueil.js";
import { asyncHandler } from "../middleware/error_middleware.js";

const router = express.Router();

router.get("/accueil", asyncHandler(getAccueil));

export default router;
