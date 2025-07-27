import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  updateBusinessProfile,
  updateSupplierProfile,
  getUsersByCity,
  getUsersByArea,
  verifyUser
} from "../controllers/userAuthController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", requireAuth, getUserProfile);
router.put("/profile", requireAuth, updateUserProfile);
router.put("/business", requireAuth, updateBusinessProfile);
router.put("/supplier", requireAuth, updateSupplierProfile);
router.get("/city/:city", getUsersByCity);
router.get("/city/:city/area/:area", getUsersByArea);
router.patch("/verify/:id", requireAuth, verifyUser);

export default router;
