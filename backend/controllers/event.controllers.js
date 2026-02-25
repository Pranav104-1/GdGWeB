const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { sendSuccess, sendError } = require("../utils/responseHandler");

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ date: 1 }); // Sort by date ascending

    return sendSuccess(res, 200, "Events retrieved successfully", {
      events,
      count: events.length,
    });
  } catch (error) {
    console.error("Get events error:", error);
    return sendError(res, 500, "Error retrieving events", error.message);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");

    if (!event) {
      return sendError(res, 404, "Event not found");
    }

    // Get registration count
    const registrationCount = await Registration.countDocuments({
      eventId: event._id,
    });

    return sendSuccess(res, 200, "Event retrieved successfully", {
      event,
      registrationCount,
    });
  } catch (error) {
    console.error("Get event error:", error);
    if (error.kind === "ObjectId") {
      return sendError(res, 400, "Invalid event ID");
    }
    return sendError(res, 500, "Error retrieving event", error.message);
  }
};

// @desc    Create event (Admin only)
// @route   POST /api/events
// @access  Private (Admin)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || !maxParticipants) {
      return sendError(res, 400, "Please provide all required fields");
    }

    // Validate date
    if (new Date(date) < new Date()) {
      return sendError(res, 400, "Event date cannot be in the past");
    }

    // Create event
    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date,
      location: location.trim(),
      maxParticipants,
      createdBy: req.user.id,
    });

    await event.populate("createdBy", "name email");

    return sendSuccess(res, 201, "Event created successfully", {
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    return sendError(res, 500, "Error creating event", error.message);
  }
};

// @desc    Update event (Admin only)
// @route   PUT /api/events/:id
// @access  Private (Admin)
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants, status } = req.body;

    let event = await Event.findById(req.params.id);

    if (!event) {
      return sendError(res, 404, "Event not found");
    }

    // Check if user is event creator
    if (event.createdBy.toString() !== req.user.id) {
      return sendError(res, 403, "Not authorized to update this event");
    }

    // Update fields
    if (title) event.title = title.trim();
    if (description) event.description = description.trim();
    if (date) event.date = date;
    if (location) event.location = location.trim();
    if (maxParticipants) event.maxParticipants = maxParticipants;
    if (status) event.status = status;

    event = await event.save();
    await event.populate("createdBy", "name email");

    return sendSuccess(res, 200, "Event updated successfully", {
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    if (error.kind === "ObjectId") {
      return sendError(res, 400, "Invalid event ID");
    }
    return sendError(res, 500, "Error updating event", error.message);
  }
};

// @desc    Delete event (Admin only)
// @route   DELETE /api/events/:id
// @access  Private (Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return sendError(res, 404, "Event not found");
    }

    // Check if user is event creator
    if (event.createdBy.toString() !== req.user.id) {
      return sendError(res, 403, "Not authorized to delete this event");
    }

    // Delete event and its registrations
    await event.deleteOne();
    await Registration.deleteMany({ eventId: req.params.id });

    return sendSuccess(res, 200, "Event deleted successfully");
  } catch (error) {
    console.error("Delete event error:", error);
    if (error.kind === "ObjectId") {
      return sendError(res, 400, "Invalid event ID");
    }
    return sendError(res, 500, "Error deleting event", error.message);
  }
};

// @desc    Get event registrations
// @route   GET /api/events/:id/registrations
// @access  Private (Admin)
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return sendError(res, 404, "Event not found");
    }

    const registrations = await Registration.find({
      eventId: req.params.id,
    })
      .populate("userId", "name email")
      .sort({ registeredAt: -1 });

    return sendSuccess(res, 200, "Registrations retrieved successfully", {
      registrations,
      count: registrations.length,
    });
  } catch (error) {
    console.error("Get registrations error:", error);
    return sendError(res, 500, "Error retrieving registrations", error.message);
  }
};
