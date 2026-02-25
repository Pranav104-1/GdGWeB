const Registration = require("../models/Registration");
const Event = require("../models/Event");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/responseHandler");

// @desc    Register user for event
// @route   POST /api/events/:eventId/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return sendError(res, 404, "Event not found");
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      userId,
      eventId,
    });

    if (existingRegistration) {
      return sendError(res, 409, "You are already registered for this event");
    }

    // Check if event has capacity
    const registrationCount = await Registration.countDocuments({
      eventId,
    });

    if (registrationCount >= event.maxParticipants) {
      return sendError(res, 400, "Event is full. No more registrations allowed");
    }

    // Create registration
    const registration = await Registration.create({
      userId,
      eventId,
    });

    // Update event participant count
    event.currentParticipants = registrationCount + 1;
    await event.save();

    // Populate user and event details
    await registration.populate("userId", "name email");
    await registration.populate("eventId", "title description date location");

    return sendSuccess(res, 201, "Registered for event successfully", {
      registration,
    });
  } catch (error) {
    console.error("Register for event error:", error);
    if (error.kind === "ObjectId") {
      return sendError(res, 400, "Invalid event ID");
    }
    return sendError(res, 500, "Error registering for event", error.message);
  }
};

// @desc    Get user's events (registered events)
// @route   GET /api/user/events
// @access  Private
exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await Registration.find({ userId })
      .populate("eventId")
      .sort({ registeredAt: -1 });

    const events = registrations.map((reg) => ({
      ...reg.eventId.toObject(),
      registeredAt: reg.registeredAt,
      registrationId: reg._id,
      registrationStatus: reg.status,
    }));

    return sendSuccess(res, 200, "User events retrieved successfully", {
      events,
      count: events.length,
    });
  } catch (error) {
    console.error("Get user events error:", error);
    return sendError(res, 500, "Error retrieving user events", error.message);
  }
};

// @desc    Get user's event registrations
// @route   GET /api/user/registrations
// @access  Private
exports.getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await Registration.find({ userId })
      .populate("userId", "name email")
      .populate("eventId", "title description date location")
      .sort({ registeredAt: -1 });

    return sendSuccess(res, 200, "User registrations retrieved successfully", {
      registrations,
      count: registrations.length,
    });
  } catch (error) {
    console.error("Get user registrations error:", error);
    return sendError(res, 500, "Error retrieving registrations", error.message);
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:registrationId
// @access  Private
exports.cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return sendError(res, 404, "Registration not found");
    }

    // Check if user is the one who registered
    if (registration.userId.toString() !== userId) {
      return sendError(res, 403, "Not authorized to cancel this registration");
    }

    const eventId = registration.eventId;

    // Delete registration
    await registration.deleteOne();

    // Update event participant count
    const event = await Event.findById(eventId);
    if (event && event.currentParticipants > 0) {
      event.currentParticipants -= 1;
      await event.save();
    }

    return sendSuccess(res, 200, "Registration cancelled successfully");
  } catch (error) {
    console.error("Cancel registration error:", error);
    if (error.kind === "ObjectId") {
      return sendError(res, 400, "Invalid registration ID");
    }
    return sendError(res, 500, "Error cancelling registration", error.message);
  }
};

// @desc    Check if user is registered for event
// @route   GET /api/events/:eventId/is-registered
// @access  Private
exports.checkRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findOne({
      userId,
      eventId,
    });

    return sendSuccess(res, 200, "Registration status retrieved", {
      isRegistered: !!registration,
      registration: registration || null,
    });
  } catch (error) {
    console.error("Check registration error:", error);
    return sendError(res, 500, "Error checking registration", error.message);
  }
};
