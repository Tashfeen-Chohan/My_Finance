import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Vehicle } from "../models/Vehicle";
import { FuelExpense } from "../models/FuelExpense";

export const getPublicTestData = async (req: Request, res: Response): Promise<void> => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    let usersCount = 0;
    let vehiclesCount = 0;
    let fuelExpensesCount = 0;
    let sampleUsers: any[] = [];
    let sampleVehicles: any[] = [];
    let sampleFuelExpenses: any[] = [];

    if (isDbConnected) {
      [usersCount, vehiclesCount, fuelExpensesCount] = await Promise.all([
        User.countDocuments({ isDeleted: false }),
        Vehicle.countDocuments({ isDeleted: false }),
        FuelExpense.countDocuments({ isDeleted: false }),
      ]);

      [sampleUsers, sampleVehicles, sampleFuelExpenses] = await Promise.all([
        User.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(3).lean(),
        Vehicle.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(3).lean(),
        FuelExpense.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(3).lean(),
      ]);
    }

    // Sanitize sample users to remove sensitive token fields if present
    const sanitizedUsers = sampleUsers.map((u: any) => {
      const { refreshToken, googleId, ...rest } = u;
      return { ...rest, id: u._id };
    });

    const isUsingFallback = sanitizedUsers.length === 0 && sampleVehicles.length === 0 && sampleFuelExpenses.length === 0;

    const fallbackDummyData = {
      users: [
        { id: "dummy_u1", name: "Test User Alpha", email: "test.alpha@example.com", createdAt: new Date() },
        { id: "dummy_u2", name: "Test User Beta", email: "test.beta@example.com", createdAt: new Date() },
      ],
      vehicles: [
        { id: "dummy_v1", make: "Toyota", model: "Corolla", year: 2022, licensePlate: "TEST-123" },
        { id: "dummy_v2", make: "Honda", model: "Civic", year: 2021, licensePlate: "DEMO-456" },
      ],
      fuelExpenses: [
        { id: "dummy_f1", liters: 45, totalCost: 12000, pricePerLiter: 266.6, odometer: 15400, date: new Date() },
        { id: "dummy_f2", liters: 40, totalCost: 10600, pricePerLiter: 265.0, odometer: 15850, date: new Date() },
      ],
    };

    res.json({
      success: true,
      message: "Public DB & CORS test API route reached successfully!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      dbStatus: {
        isConnected: isDbConnected,
        readyState: mongoose.connection.readyState,
        dbName: mongoose.connection.name || "N/A",
      },
      requestInfo: {
        origin: req.headers.origin || "No origin header (direct/same-origin)",
        userAgent: req.headers["user-agent"] || "Unknown",
      },
      counts: {
        users: usersCount,
        vehicles: vehiclesCount,
        fuelExpenses: fuelExpensesCount,
      },
      data: {
        isUsingFallback,
        users: sanitizedUsers.length > 0 ? sanitizedUsers : fallbackDummyData.users,
        vehicles: sampleVehicles.length > 0 ? sampleVehicles : fallbackDummyData.vehicles,
        fuelExpenses: sampleFuelExpenses.length > 0 ? sampleFuelExpenses : fallbackDummyData.fuelExpenses,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching test data from DB",
      error: error?.message || "Unknown error",
    });
  }
};
