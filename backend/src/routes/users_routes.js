import express from "express";
import * as usersController from "../controllers/users.js";
import {
  exigerJetonValide,
  exigerRessourceUtilisateur,
} from "../middleware/auth_jwt_middleware.js";
import { asyncHandler } from "../middleware/error_middleware.js";

const router = express.Router();

router.get("/user", asyncHandler(usersController.getUser));
router.post(
  "/auth/login",
  express.json(),
  asyncHandler(usersController.postAuthLogin)
);
router.get(
  "/auth/me",
  exigerJetonValide,
  asyncHandler(usersController.getAuthMe)
);
router.post(
  "/users",
  express.json(),
  asyncHandler(usersController.createUser)
);
router.put(
  "/users/:id",
  express.json(),
  exigerJetonValide,
  exigerRessourceUtilisateur("id"),
  asyncHandler(usersController.updateUser)
);
router.delete(
  "/users/:id",
  exigerJetonValide,
  exigerRessourceUtilisateur("id"),
  asyncHandler(usersController.deleteUser)
);

export default router;
