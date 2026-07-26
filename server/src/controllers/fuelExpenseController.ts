import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createFuelExpense as createFuelExpenseService,
  getUserFuelExpenses as getUserFuelExpensesService,
  getFuelExpensesByVehicle as getFuelExpensesByVehicleService,
  getFuelExpenseById as getFuelExpenseByIdService,
  updateFuelExpense as updateFuelExpenseService,
  deleteFuelExpense as deleteFuelExpenseService,
} from "../services/fuelExpenseService";
import { UnauthorizedError } from "../errors/ApiError";

export const createFuelExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const expense = await createFuelExpenseService(req.user.id, req.body);
  res.status(201).json({ success: true, data: expense });
};

export const getAllFuelExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const expenses = await getUserFuelExpensesService(req.user.id);
  res.json({ success: true, data: expenses });
};

export const getFuelExpensesByVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const expenses = await getFuelExpensesByVehicleService(String(req.params.vehicleId), req.user.id);
  res.json({ success: true, data: expenses });
};

export const getFuelExpenseById = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const expense = await getFuelExpenseByIdService(String(req.params.id), req.user.id);
  res.json({ success: true, data: expense });
};

export const updateFuelExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const expense = await updateFuelExpenseService(String(req.params.id), req.user.id, req.body);
  res.json({ success: true, data: expense });
};

export const deleteFuelExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  await deleteFuelExpenseService(String(req.params.id), req.user.id);
  res.json({ success: true, message: "Fuel expense record deleted successfully" });
};
