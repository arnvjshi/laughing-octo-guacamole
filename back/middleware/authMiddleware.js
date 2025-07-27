import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

dotenv.config();
// Middleware to protect routes
export const requireAuth = (req, res, next) => {
  let token;

  // Priority 1: Authorization header
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Priority 2: Cookie fallback
  if (!token && req.cookies?.AuthToken) {
    token = req.cookies.AuthToken;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  }catch (err) {
  console.error("JWT Error:", err);
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: "Unauthorized: Token expired" });
  }
  return res.status(401).json({ message: "Unauthorized: Invalid token" });
}
};
