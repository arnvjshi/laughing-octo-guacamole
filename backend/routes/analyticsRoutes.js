import express from "express";
import {
  getUserStats,
  getGroupStats,
  getSupplierStats,
  getPlatformStats,
  calculateSavings,
  getPopularProducts,
  getPopularSuppliers
} from "../controllers/analyticsController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", requireAuth, getUserStats);
router.get("/group", requireAuth, getGroupStats);
router.get("/supplier", requireAuth, getSupplierStats);
router.get("/platform", requireAuth, getPlatformStats);
router.get("/savings", requireAuth, calculateSavings);
router.get("/popular-products", requireAuth, getPopularProducts);
router.get("/popular-suppliers", requireAuth, getPopularSuppliers);

export default router;
