const express = require("express");
const corsMiddleware = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();

// Route imports
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const adminRoutes = require("./routes/admin.routes");

// Middleware imports
const errorHandler = require("./middleware/errorHandler");

// Initialize express app
const app = express();

// ==================== SECURITY MIDDLEWARE ====================
// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limiting to API routes
app.use("/api/", limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit to 10 requests per hour
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true, // Don't count successful requests
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/send-otp", authLimiter);

// ==================== BODY PARSER MIDDLEWARE ====================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==================== CORS MIDDLEWARE ====================
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(corsMiddleware(corsOptions));

// ==================== LOGGING MIDDLEWARE ====================
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ==================== HEALTH CHECK ====================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

// ==================== 404 HANDLER ====================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ==================== ERROR HANDLING MIDDLEWARE ====================
app.use(errorHandler);

module.exports = app;
