/**
 * Script: calculateMissingDailyUsage.ts
 * Calculates missing daily usage (dailyDistanceDriven) for fuel expense entries that do not have it.
 *
 * Usage Commands:
 *   - Local DB:      npm run db:calculate-missing-daily-usage
 *   - Production DB: npm run db:calculate-missing-daily-usage:prod
 */

import dotenv from "dotenv";
import path from "path";
import dns from "dns";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Set fallback DNS servers to resolve MongoDB Atlas SRV/TXT records reliably
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore error if custom DNS fails to set
}

import mongoose from "mongoose";
import { FuelExpense } from "../models/FuelExpense";

async function calculateMissingDailyUsage() {
  const isProd = process.argv.includes("--prod");
  const mongoUri =
    process.env.MONGO_URI ||
    (isProd ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV) ||
    process.env.MONGO_URI_DEV ||
    "mongodb://127.0.0.1:27017/my_finance";

  console.log("🚀 Starting Calculation for Missing Daily Distance Driven");
  console.log(`🔹 Target Database: ${mongoUri.replace(/:([^@]+)@/, ":****@")}\n`);

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB.");

    const vehicleIds = await FuelExpense.distinct("vehicleId", { isDeleted: false });
    console.log(`📦 Found ${vehicleIds.length} vehicle(s) with fuel records.\n`);

    let totalUpdatedCount = 0;
    let totalSkippedCount = 0;

    for (const vehicleId of vehicleIds) {
      const logs = await FuelExpense.find({ vehicleId, isDeleted: false }).sort({ odometer: 1, date: 1 });

      if (logs.length < 2) continue;

      console.log(`🔄 Checking ${logs.length} fuel entries for vehicleId: ${vehicleId}`);

      for (let i = 0; i < logs.length - 1; i++) {
        const refillA = logs[i];
        const refillB = logs[i + 1];

        // Skip if dailyDistanceDriven is already present and calculated
        if (refillA.dailyDistanceDriven !== undefined && refillA.dailyDistanceDriven !== null) {
          totalSkippedCount++;
          continue;
        }

        const distanceTraveled = refillA.distanceTraveled ?? (refillB.odometer - refillA.odometer);
        if (distanceTraveled <= 0) continue;

        const dateA = new Date(refillA.date);
        const dateB = new Date(refillB.date);
        const diffInMs = Math.max(0, dateB.getTime() - dateA.getTime());
        const daysElapsed = Math.max(1, Math.round(diffInMs / (1000 * 60 * 60 * 24)));
        const dailyDistanceDriven = Math.round(distanceTraveled / daysElapsed);

        await FuelExpense.updateOne(
          { _id: refillA._id },
          {
            $set: {
              dailyDistanceDriven,
            },
          }
        );

        console.log(`   └─ Updated log ${refillA._id}: ${distanceTraveled} km over ${daysElapsed} day(s) ➔ ${dailyDistanceDriven} km/day`);
        totalUpdatedCount++;
      }
    }

    console.log(`\n🎉 COMPLETED! Updated ${totalUpdatedCount} log(s) missing daily usage (${totalSkippedCount} log(s) already up to date).`);
  } catch (error) {
    console.error("❌ Process failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

calculateMissingDailyUsage();
