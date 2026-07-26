import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  setDefaultVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../middleware/validateRequest";
import { createVehicleSchema, updateVehicleSchema, vehicleIdParamSchema } from "../validations/vehicleValidation";

const router = Router();

router.use(authenticateJwt);

router.post("/", validateRequest(createVehicleSchema), asyncHandler(createVehicle));
router.get("/", asyncHandler(getVehicles));
router.get("/:id", validateRequest(vehicleIdParamSchema), asyncHandler(getVehicleById));
router.put("/:id", validateRequest(updateVehicleSchema), asyncHandler(updateVehicle));
router.patch("/:id/default", validateRequest(vehicleIdParamSchema), asyncHandler(setDefaultVehicle));
router.delete("/:id", validateRequest(vehicleIdParamSchema), asyncHandler(deleteVehicle));

export default router;
