import { Router } from "express";
import authRoutes from "./authRoutes";
import vehicleRoutes from "./vehicleRoutes";
import fuelExpenseRoutes from "./fuelExpenseRoutes";
import maintenanceRoutes from "./maintenanceRoutes";
import dashboardRoutes from "./dashboardRoutes";
import settingsRoutes from "./settingsRoutes";
import preferenceRoutes from "./preferenceRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/fuel-expenses", fuelExpenseRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/settings", settingsRoutes);
router.use("/preferences", preferenceRoutes);

export default router;
