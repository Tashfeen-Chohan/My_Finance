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
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// MongoDB Connection Caching for Vercel Serverless Execution & Environment Auto-Switch
let isConnected = false;
let dbConnectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }

  const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  
  const MONGO_URI = isProduction
    ? (process.env.MONGO_URI_PROD || process.env.MONGO_URI || "mongodb://localhost:27017/my_finance")
    : (process.env.MONGO_URI_DEV || process.env.MONGO_URI || "mongodb://localhost:27017/my_finance");

  const dbTargetName = isProduction ? "MongoDB Atlas (Production)" : "MongoDB Compass (Development)";

  dbConnectionPromise = mongoose
    .connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then((m) => {
      isConnected = true;
      logger.info(`Successfully connected to ${dbTargetName}`);
      return m;
    })
    .catch((err) => {
      dbConnectionPromise = null;
      logger.error(`MongoDB Connection Error [${dbTargetName}]: ${(err as Error).message}`);
      throw err;
    });

  return dbConnectionPromise;
};

// Immediately initiate DB connection on module load / server startup to eliminate first request latency
connectDB().catch((err) => {
  logger.warn(`Initial MongoDB startup connection attempt failed, will reconnect on request: ${(err as Error).message}`);
});

// Middleware: Ensure DB connection before handling requests
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// HTTP request logger middleware
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
});

// Security & Parsing Middleware
const allowedOrigins = [
  CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, origin);
      }
      return callback(null, origin);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Root Welcome Endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "🚀 Welcome to My_Finance REST API",
    status: "online",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    healthCheck: "/api/health",
  });
});

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

// Start server locally if not running in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info(`Express REST API Server running on port ${PORT} [http://localhost:${PORT}]`);
  });
}

export default app;
