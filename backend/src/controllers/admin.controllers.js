import { auth } from "../models/auth.models.js";
import { generateToken, generateRefreshToken } from "../utils/token.utils.js";
import bcrypt from "bcryptjs";

// ============== ADMIN LOGIN ==============
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user with admin role
    const user = await auth.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Admin login successful",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    return res.status(500).json({
      error: "Failed to login",
      details: error.message,
    });
  }
};

// ============== GET ALL USERS ==============
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const users = await auth
      .find(query)
      .select("-password -otp -resetToken")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await auth.countDocuments(query);

    return res.status(200).json({
      users,
      totalUsers: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({
      error: "Failed to fetch users",
      details: error.message,
    });
  }
};

// ============== GET USER DETAILS ==============
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await auth.findById(userId).select("-password -otp -resetToken");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    return res.status(500).json({
      error: "Failed to fetch user details",
      details: error.message,
    });
  }
};

// ============== UPDATE USER ROLE ==============
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "organizer", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await auth.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return res.status(500).json({
      error: "Failed to update user role",
      details: error.message,
    });
  }
};

// ============== DELETE USER ==============
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminUserId = req.user.id;

    // Prevent admin from deleting themselves
    if (userId === adminUserId) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    const user = await auth.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      deletedUser: user.email,
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({
      error: "Failed to delete user",
      details: error.message,
    });
  }
};

// ============== GET DASHBOARD STATS ==============
export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await auth.countDocuments();
    const totalAdmins = await auth.countDocuments({ role: "admin" });
    const totalOrganizers = await auth.countDocuments({ role: "organizer" });
    const totalRegularUsers = await auth.countDocuments({ role: "user" });
    const verifiedEmails = await auth.countDocuments({ isEmailVerified: true });
    const unverifiedEmails = await auth.countDocuments({ isEmailVerified: false });

    // Get new users in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsers = await auth.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    return res.status(200).json({
      stats: {
        totalUsers,
        totalAdmins,
        totalOrganizers,
        totalRegularUsers,
        verifiedEmails,
        unverifiedEmails,
        newUsersLastWeek: newUsers,
      },
    });
  } catch (error) {
    console.error("Error in getAdminDashboardStats:", error);
    return res.status(500).json({
      error: "Failed to fetch dashboard stats",
      details: error.message,
    });
  }
};
