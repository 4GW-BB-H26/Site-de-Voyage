import express from "express";
import * as usersController from "../controllers/users.js";
import {
  exigerJetonValide,
  exigerRessourceUtilisateur,
} from "../middleware/auth_jwt_middleware.js";

const router = express.Router();

router.get("/user", usersController.getUser);
router.post("/auth/login", express.json(), usersController.postAuthLogin);
router.get("/auth/me", exigerJetonValide, usersController.getAuthMe);
router.post("/users", express.json(), usersController.createUser);
router.put(
  "/users/:id",
  express.json(),
  exigerJetonValide,
  exigerRessourceUtilisateur("id"),
  usersController.updateUser
);
router.delete(
  "/users/:id",
  exigerJetonValide,
  exigerRessourceUtilisateur("id"),
  usersController.deleteUser
);

export default router;
