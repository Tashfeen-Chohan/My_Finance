/**
 * Script: recalculateFuelStats.ts
 * Recalculates fuel stats (distanceTraveled, computedEconomy, costPerKM, isLocked) for fuel expense entries.
 *
 * Usage Commands:
 *   - Local DB:      npm run db:recalculate-fuel
 *   - Production DB: npm run db:recalculate-fuel:prod
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

async function recalculateFuelStats() {
  // Select target database based on CLI flag (--prod) or environment variable
  // - Local DB:      npm run db:recalculate-fuel       (uses MONGO_URI_DEV)
  // - Production DB: npm run db:recalculate-fuel:prod  (uses MONGO_URI_PROD)
  const isProd = process.argv.includes("--prod");
  const mongoUri =
    process.env.MONGO_URI ||
    (isProd ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV) ||
    process.env.MONGO_URI_DEV ||
    "mongodb://127.0.0.1:27017/my_finance";

  console.log("🚀 Starting Fuel Expenses Recalculation");
  console.log(`🔹 Target Database: ${mongoUri.replace(/:([^@]+)@/, ":****@")}\n`);

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB.");

    const vehicleIds = await FuelExpense.distinct("vehicleId", { isDeleted: false });
    console.log(`📦 Found ${vehicleIds.length} vehicle(s) with fuel records.\n`);

    let totalUpdatedCount = 0;

    for (const vehicleId of vehicleIds) {
      const logs = await FuelExpense.find({ vehicleId, isDeleted: false }).sort({ odometer: 1, date: 1 });

      if (logs.length === 0) continue;

      console.log(`🔄 Processing ${logs.length} fuel entries for vehicleId: ${vehicleId}`);

      for (let i = 0; i < logs.length - 1; i++) {
        const refillA = logs[i];
        const refillB = logs[i + 1];

        const distanceTraveled = refillB.odometer - refillA.odometer;
        const isFullTankInterval = Boolean(refillA.isFullTank && refillB.isFullTank);

        const computedEconomy = isFullTankInterval && refillB.quantity > 0
          ? Number((distanceTraveled / refillB.quantity).toFixed(2))
          : null;

        const previousUnitPrice = refillA.unitPrice || 0;
        const fuelConsumedCost = refillB.quantity * previousUnitPrice;

        const costPerKM = isFullTankInterval && distanceTraveled > 0 && fuelConsumedCost > 0
          ? Number((fuelConsumedCost / distanceTraveled).toFixed(2))
          : null;

        await FuelExpense.updateOne(
          { _id: refillA._id },
          {
            $set: {
              distanceTraveled: distanceTraveled > 0 ? distanceTraveled : null,
              computedEconomy,
              costPerKM,
              isLocked: true,
            },
          }
        );

        totalUpdatedCount++;
      }

      // Unlock the latest entry for this vehicle
      const latestRefill = logs[logs.length - 1];
      await FuelExpense.updateOne(
        { _id: latestRefill._id },
        {
          $set: {
            distanceTraveled: null,
            computedEconomy: null,
            costPerKM: null,
            isLocked: false,
          },
        }
      );
    }

    console.log(`\n🎉 RECALCULATION COMPLETE! Successfully updated ${totalUpdatedCount} fuel record(s).`);
  } catch (error) {
    console.error("❌ Recalculation failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

recalculateFuelStats();
