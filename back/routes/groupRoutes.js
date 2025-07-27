import express from "express";
import {
  createGroup,
  getGroupById,
  getGroupsByCity,
  getGroupsByArea,
  getActiveGroups,
  updateGroupStatus,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getGroupMembers,
  updateMemberRole
} from "../controllers/groupController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, createGroup);
router.get("/:groupId", requireAuth, getGroupById);
router.get("/city/:city", requireAuth, getGroupsByCity);
router.get("/city/:city/area/:area", requireAuth, getGroupsByArea);
router.get("/active/all", requireAuth, getActiveGroups);
router.patch("/:groupId/status", requireAuth, updateGroupStatus);
router.delete("/:groupId", requireAuth, deleteGroup);
router.post("/:groupId/join", requireAuth, joinGroup);
router.post("/:groupId/leave", requireAuth, leaveGroup);
router.get("/:groupId/members", requireAuth, getGroupMembers);
router.patch("/:groupId/members/:userId/role", requireAuth, updateMemberRole);

export default router;
