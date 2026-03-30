import express from "express";
import * as usersController from "../controllers/users.js";

const router = express.Router();

router.get("/user", usersController.getUser);
router.post("/users", express.json(), usersController.createUser);
router.put("/users/:id", express.json(), usersController.updateUser);
router.delete("/users/:id", usersController.deleteUser);

export default router;
