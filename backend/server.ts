import express from "express";
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from "./config/database.js";
import { initializeSocket } from "./config/socket.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { logger } from "./utils/logger.js";

// Routes
import busRoutes from "./bus/routes/busRoutes.js";
import studentRoutes from "./student/routes/studentRoutes.js";
import routeRoutes from "./route/routes/routeRoutes.js";
import stopRoutes from "./stop/routes/stopRoutes.js";
import accountRoutes from "./account/routes/accountRoutes.js";
import notificationRoutes from "./Notification/Routes/notificationRoutes.js";
// import adminRoutes from "./admin/routes/adminRoutes.js";
// import driverRoutes from "./driver/routes/driverRoutes.js";
// import parentRoutes from "./parent/routes/parentRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ĐĂNG KÝ CÁC ROUTE
app.use("/account", accountRoutes);
app.use("/buses", busRoutes);
app.use("/students", studentRoutes);
app.use("/routes", routeRoutes);
app.use("/stops", stopRoutes);
app.use("/notifications", notificationRoutes);  // 🚀 Notification routes
// app.use("/admin", adminRoutes);      // TODO: Tạo routes này
// app.use("/driver", driverRoutes);    // TODO: Tạo routes này
// app.use("/parent", parentRoutes);    // TODO: Tạo routes này

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Tạo HTTP server để hỗ trợ Socket.IO
const httpServer = createServer(app);

// Khởi tạo Socket.IO
initializeSocket(httpServer);

// Test database connection và start server
testConnection().then(() => {
  httpServer.listen(PORT, () => {
    logger.info(`✅ SSB Backend running on http://localhost:${PORT}`);
    logger.info(`🚀 Socket.IO ready for realtime notifications`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});