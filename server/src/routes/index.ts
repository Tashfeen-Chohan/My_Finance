import { Router } from "express";
import authRoutes from "./authRoutes";
import vehicleRoutes from "./vehicleRoutes";
import fuelExpenseRoutes from "./fuelExpenseRoutes";
import maintenanceRoutes from "./maintenanceRoutes";
import dashboardRoutes from "./dashboardRoutes";
import settingsRoutes from "./settingsRoutes";
import publicRoutes from "./publicRoutes";
import { getPublicTestData } from "../controllers/publicTestController";

const router = Router();

router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/fuel-expenses", fuelExpenseRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/settings", settingsRoutes);
router.use("/public", publicRoutes);
router.get("/test-db", getPublicTestData);

export default router;

