import express from "express";
import {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  sendOrderStatusNotification,
  sendGroupNotification,
  deleteNotification
} from "../controllers/notificationController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, createNotification);
router.get("/", requireAuth, getUserNotifications);
router.patch("/:notificationId/read", requireAuth, markNotificationRead);
router.post("/order-status", requireAuth, sendOrderStatusNotification);
router.post("/group", requireAuth, sendGroupNotification);
router.delete("/:notificationId", requireAuth, deleteNotification);

export default router;
