import { Router } from "express";
import {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceByVehicle,
  getMaintenanceById,
  getUpcomingServices,
  updateMaintenance,
  deleteMaintenance,
} from "../controllers/maintenanceController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../middleware/validateRequest";
import { createMaintenanceSchema, updateMaintenanceSchema } from "../validations/maintenanceValidation";

const router = Router();

router.use(authenticateJwt);

router.get("/", asyncHandler(getAllMaintenance));
router.post("/", validateRequest(createMaintenanceSchema), asyncHandler(createMaintenance));
router.get("/upcoming", asyncHandler(getUpcomingServices));
router.get("/vehicle/:vehicleId", asyncHandler(getMaintenanceByVehicle));
router.get("/:id", asyncHandler(getMaintenanceById));
router.put("/:id", validateRequest(updateMaintenanceSchema), asyncHandler(updateMaintenance));
router.delete("/:id", asyncHandler(deleteMaintenance));

export default router;
