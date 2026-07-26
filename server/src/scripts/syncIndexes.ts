import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { User } from "../models/User";
import { Vehicle } from "../models/Vehicle";
import { FuelExpense } from "../models/FuelExpense";
import { MaintenanceExpense } from "../models/MaintenanceExpense";
import { logger } from "../utils/logger";

const syncDatabaseIndexes = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/my_finance";

  try {
    logger.info("Connecting to MongoDB database to synchronize indexes...");
    await mongoose.connect(MONGO_URI);
    logger.info("Connected to MongoDB. Starting index synchronization...");

    await User.syncIndexes();
    logger.info("✓ User model indexes synced");

    await Vehicle.syncIndexes();
    logger.info("✓ Vehicle model indexes synced");

    await FuelExpense.syncIndexes();
    logger.info("✓ FuelExpense model indexes synced");

    await MaintenanceExpense.syncIndexes();
    logger.info("✓ MaintenanceExpense model indexes synced");

    logger.info("All database indexes synchronized successfully!");
  } catch (error) {
    logger.error(`Error synchronizing indexes: ${(error as Error).message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB.");
  }
};

syncDatabaseIndexes();
