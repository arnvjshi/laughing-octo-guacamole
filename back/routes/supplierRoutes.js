import express from "express";
import {
  createSupplierProfile,
  getSupplierProfile,
  updateSupplierProfile,
  addSupplierProduct,
  updateSupplierProduct,
  removeSupplierProduct,
  getSupplierProducts,
  updateProductAvailability,
  getProductSuppliers,
  compareSupplierPrices
} from "../controllers/supplierController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, createSupplierProfile);
router.get("/:supplierId", getSupplierProfile);
router.put("/", requireAuth, updateSupplierProfile);
router.post("/products", requireAuth, addSupplierProduct);
router.put("/products/:productId", requireAuth, updateSupplierProduct);
router.delete("/products/:productId", requireAuth, removeSupplierProduct);
router.get("/products", requireAuth, getSupplierProducts);
router.patch("/products/:productId/availability", requireAuth, updateProductAvailability);
router.get("/product/:productId/suppliers", getProductSuppliers);
router.get("/compare/:productId", compareSupplierPrices);

export default router;
