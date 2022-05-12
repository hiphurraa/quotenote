import express from "express";
import { register, getAll, login, get, confirmEmail, deleteUser } from "../controllers/userController.js";
import jwtAuth from "../authentication/jwtAuthentication.js";

const router = express.Router();

//Registration and login routes
router.post("/register", register);
router.post("/login", login);
router.get("/", getAll);
router.get("/confirmation/:token", confirmEmail);
router.get("/:id", get);
router.put("/delete/:id", jwtAuth.checkAccessToken, deleteUser);

export default router;
