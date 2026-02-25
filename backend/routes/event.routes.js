const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controllers");
const registrationController = require("../controllers/registration.controllers");
const { protect, authorize } = require("../middleware/auth.middleware");

// Public routes
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

// Protected routes - User can register for events
router.post("/:eventId/register", protect, registrationController.registerForEvent);
router.get("/:eventId/is-registered", protect, registrationController.checkRegistration);

// Protected routes - User event management
router.get("/user/my-events", protect, registrationController.getUserEvents);
router.get("/user/registrations", protect, registrationController.getUserRegistrations);
router.delete("/registrations/:registrationId", protect, registrationController.cancelRegistration);

// Admin only - Event management
router.post("/", protect, authorize("admin"), eventController.createEvent);
router.put("/:id", protect, authorize("admin"), eventController.updateEvent);
router.delete("/:id", protect, authorize("admin"), eventController.deleteEvent);
router.get("/:id/registrations", protect, authorize("admin"), eventController.getEventRegistrations);

module.exports = router;
