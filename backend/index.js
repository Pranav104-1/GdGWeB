import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectdb from "./src/db/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import quizRoutes from "./src/routes/quiz.routes.js";

dotenv.config();

const app = express();

// ============== CORS CONFIGURATION ==============
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5000"  || "*",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ============== MIDDLEWARE ==============
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ============== HEALTH CHECK ENDPOINT ==============
app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "Server is running" });
});

// ============== API ROUTES ==============
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", quizRoutes);

// ============== ERROR HANDLING ==============
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ============== 404 HANDLER ==============
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" });
});

// ============== START SERVER ==============
const startServer = async () => {
  try {
    // Connect to database
    const dbConnection = await connectdb();
    
    // Start server regardless of DB connection status
    const server = app.listen(process.env.PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                   Server is Running                        ║
╠═══════════════════════════════════════════════════════════╣
║ Port: ${process.env.PORT}                                         ║
║ Environment: ${process.env.NODE_ENV}                                  ║
║ Database: ${dbConnection ? '✅ Connected' : '❌ Not Connected'}                             ║
║ Frontend URL: ${process.env.FRONTEND_URL}      ║
╠═══════════════════════════════════════════════════════════╣
║ API Endpoints:                                             ║
║ • POST /api/auth/send-otp                                  ║
║ • POST /api/auth/verify-otp                                ║
║ • POST /api/auth/register                                  ║
║ • POST /api/auth/login                                     ║
║ • POST /api/auth/logout                                    ║
║ • POST /api/auth/forgot-password                           ║
║ • POST /api/auth/reset-password                            ║
║ • POST /api/auth/refresh-token                             ║
║ • GET  /api/auth/me           (Protected)                  ║
║ • PUT  /api/auth/profile      (Protected)                  ║
║ • GET  /api/health                                         ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    return server;
  } catch (err) {
    console.error("❌ Error starting server:", err.message);
    process.exit(1);
  }
};

startServer();

export default app;

