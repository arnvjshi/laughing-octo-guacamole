
import express from "express";
import "express-async-errors"; // To catch async route errors
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";


// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// Middleware
import  errorHandlerMiddleware  from "./middleware/errorHandlerMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";

// Init
dotenv.config();
const app = express();

// CORS Config
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("BulkBite API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling (must be last)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
