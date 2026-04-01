import express from "express";
import { getAccueil } from "../controllers/accueil.js";

const router = express.Router();

router.get("/accueil", getAccueil);

export default router;
