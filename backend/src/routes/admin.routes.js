import { Router } from "express";
import {
  adminLogin,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
  getAdminDashboardStats,
} from "../controllers/admin.controllers.js";
import { authenticate, isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

// Admin login (no authentication required)
router.post("/login", adminLogin);

// Protected admin routes (require authentication and admin role)
router.get("/dashboard/stats", authenticate, isAdmin, getAdminDashboardStats);
router.get("/users", authenticate, isAdmin, getAllUsers);
router.get("/users/:userId", authenticate, isAdmin, getUserDetails);
router.put("/users/:userId/role", authenticate, isAdmin, updateUserRole);
router.delete("/users/:userId", authenticate, isAdmin, deleteUser);

export default router;
