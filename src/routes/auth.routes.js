import express from "express";
import {
  login,
  logout,
  logoutAll,
  myProfile,
  signUp,
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = new express.Router();

router.post("/sign-up", signUp);
router.post("/logout", auth, logout);
router.post("/login", login);
router.get("/my-profile", auth, myProfile);
router.post("/logout-all", auth, logoutAll);

export default router;
