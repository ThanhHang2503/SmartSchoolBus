import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from "./config/database.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { logger } from "./utils/logger.js";

// Routes
import busRoutes from "./bus/routes/busRoutes.js";
import studentRoutes from "./student/routes/studentRoutes.js";
import routeRoutes from "./route/routes/routeRoutes.js";
import stopRoutes from "./stop/routes/stopRoutes.js";
import accountRoutes from "./account/routes/accountRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/buses", busRoutes);
app.use("/students", studentRoutes);
app.use("/routes", routeRoutes);        // Đổi từ /routers thành /routes
app.use("/stops", stopRoutes);          // Thêm routes cho trạm dừng
app.use("/account", accountRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Test database connection và start server
testConnection().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});