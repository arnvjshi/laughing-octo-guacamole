import express from "express";
import {
  signUp,
  signIn,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", logout)
router.post("getCurrentUser",getCurrentUser)


export default router;
