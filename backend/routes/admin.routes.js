const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controllers");
const { protect, authorize } = require("../middleware/auth.middleware");

// Protect all admin routes
router.use(protect, authorize("admin"));

// User management
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.delete("/users/:id", adminController.deleteUser);
router.put("/users/:id/role", adminController.updateUserRole);

// Registration management
router.get("/registrations", adminController.getAllRegistrations);
router.get("/events/:eventId/registrations", adminController.getEventRegistrations);

// Dashboard
router.get("/statistics", adminController.getStatistics);

module.exports = router;
