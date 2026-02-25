const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { sendSuccess, sendError } = require("../utils/responseHandler");

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Users retrieved successfully", {
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return sendError(res, 500, "Error retrieving users", error.message);
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    // Get user's registrations
    const registrations = await Registration.find({
      userId: user._id,
    }).populate("eventId", "title date");

    return sendSuccess(res, 200, "User retrieved successfully", {
      user,
      registrations,
    });
  } catch (error) {
    console.error("Get user error:", error);
    if (error.kind === "ObjectId") {
      return sendError(res, 400, "Invalid user ID");
    }
    return sendError(res, 500, "Error retrieving user", error.message);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    // Prevent deleting admin users (except by super admin)
    if (user.role === "admin") {
      return sendError(res, 403, "Cannot delete admin users");
    }

    // Delete user and their registrations
    await user.deleteOne();
    await Registration.deleteMany({ userId: req.params.id });

    return sendSuccess(res, 200, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    if (error.kind === "ObjectId") {
      return sendError(res, 400, "Invalid user ID");
    }
    return sendError(res, 500, "Error deleting user", error.message);
  }
};

// @desc    Get all registrations (Admin only)
// @route   GET /api/admin/registrations
// @access  Private (Admin)
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "name email")
      .populate("eventId", "title date")
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

// @desc    Get registrations for specific event (Admin only)
// @route   GET /api/admin/events/:eventId/registrations
// @access  Private (Admin)
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return sendError(res, 404, "Event not found");
    }

    const registrations = await Registration.find({
      eventId: req.params.eventId,
    })
      .populate("userId", "name email")
      .sort({ registeredAt: -1 });

    return sendSuccess(res, 200, "Event registrations retrieved successfully", {
      event,
      registrations,
      count: registrations.length,
    });
  } catch (error) {
    console.error("Get event registrations error:", error);
    return sendError(res, 500, "Error retrieving registrations", error.message);
  }
};

// @desc    Get dashboard statistics (Admin only)
// @route   GET /api/admin/statistics
// @access  Private (Admin)
exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const regularUsers = totalUsers - totalAdmins;
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    // Get upcoming events
    const upcomingEvents = await Event.countDocuments({
      date: { $gt: new Date() },
    });

    // Get recent registrations
    const recentRegistrations = await Registration.find()
      .sort({ registeredAt: -1 })
      .limit(10)
      .populate("userId", "name email")
      .populate("eventId", "title");

    return sendSuccess(res, 200, "Statistics retrieved successfully", {
      totalUsers,
      totalAdmins,
      regularUsers,
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      recentRegistrations,
    });
  } catch (error) {
    console.error("Get statistics error:", error);
    return sendError(res, 500, "Error retrieving statistics", error.message);
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return sendError(res, 400, "Invalid role");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, "User role updated successfully", {
      user,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    if (error.kind === "ObjectId") {
      return sendError(res, 400, "Invalid user ID");
    }
    return sendError(res, 500, "Error updating user role", error.message);
  }
};
