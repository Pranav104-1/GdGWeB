const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4565;
const NODE_ENV = process.env.NODE_ENV || "development";

// Connect to database
connectDB();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Error: ${err.message}`);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║     GDG CSMU Backend API Server               ║
║     Environment: ${NODE_ENV.padEnd(33)} ║
║     Port: ${PORT.toString().padEnd(43)} ║
╚═══════════════════════════════════════════════╝

✅ Server is running on http://localhost:${PORT}
📚 API Documentation available at /api/docs
🔐 Authentication: JWT Bearer Token
  `);
});

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error(`❌ Server Error: ${error.message}`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("📌 SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("📌 SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });
});

module.exports = server;
