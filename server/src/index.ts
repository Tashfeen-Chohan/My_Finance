import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import apiRoutes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// HTTP request logger middleware
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
});

// Security & Parsing Middleware
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Mount All API Routes
app.use("/api", apiRoutes);

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Centralized Error Handling Middleware
app.use(errorHandler);

// MongoDB Connection Bootstrap
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/my_finance";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info("Successfully connected to MongoDB Database");
  })
  .catch((err) => {
    logger.warn(`MongoDB Connection Warning: ${err.message}`);
  });

app.listen(PORT, () => {
  logger.info(`Express REST API Server running on port ${PORT} [http://localhost:${PORT}]`);
});
