import express from "express";
import {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/search", searchProducts);
router.get("/:productId", getProductById);
router.post("/", requireAuth, addProduct);
router.put("/:productId", requireAuth, updateProduct);
router.delete("/:productId", requireAuth, deleteProduct);

export default router;
