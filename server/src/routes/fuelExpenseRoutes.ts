import { Router } from "express";
import {
  createFuelExpense,
  getAllFuelExpenses,
  getFuelExpensesByVehicle,
  getFuelExpenseById,
  updateFuelExpense,
  deleteFuelExpense,
} from "../controllers/fuelExpenseController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../middleware/validateRequest";
import { createFuelExpenseSchema, updateFuelExpenseSchema, expenseIdParamSchema } from "../validations/fuelExpenseValidation";

const router = Router();

router.use(authenticateJwt);

router.post("/", validateRequest(createFuelExpenseSchema), asyncHandler(createFuelExpense));
router.get("/", asyncHandler(getAllFuelExpenses));
router.get("/vehicle/:vehicleId", asyncHandler(getFuelExpensesByVehicle));
router.get("/:id", validateRequest(expenseIdParamSchema), asyncHandler(getFuelExpenseById));
router.put("/:id", validateRequest(updateFuelExpenseSchema), asyncHandler(updateFuelExpense));
router.delete("/:id", validateRequest(expenseIdParamSchema), asyncHandler(deleteFuelExpense));

export default router;
