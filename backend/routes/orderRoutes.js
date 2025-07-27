import express from "express";
import {
  addProductToOrder,
  updateProductQuantity,
  removeProductFromOrder,
  getUserOrdersInGroup,
  getGroupOrders,
  calculateGroupTotal,
  createFinalOrder,
  getOrderById,
  getUserOrderHistory,
  getSupplierOrders,
  updateOrderStatus,
  updateDeliveryETA,
  calculateCostSplit
} from "../controllers/orderController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/cart/add", requireAuth, addProductToOrder);
router.patch("/cart/update", requireAuth, updateProductQuantity);
router.delete("/cart/remove", requireAuth, removeProductFromOrder);
router.get("/group/:groupId/user", requireAuth, getUserOrdersInGroup);
router.get("/group/:groupId", requireAuth, getGroupOrders);
router.get("/group/:groupId/total", requireAuth, calculateGroupTotal);
router.post("/final", requireAuth, createFinalOrder);
router.get("/:orderId", requireAuth, getOrderById);
router.get("/history", requireAuth, getUserOrderHistory);
router.get("/supplier", requireAuth, getSupplierOrders);
router.patch("/:orderId/status", requireAuth, updateOrderStatus);
router.patch("/:orderId/eta", requireAuth, updateDeliveryETA);
router.get("/:orderId/split", requireAuth, calculateCostSplit);

export default router;
