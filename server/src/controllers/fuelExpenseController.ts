import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { FuelExpenseService } from "../services/fuelExpenseService";
import { UnauthorizedError } from "../errors/ApiError";

export const createFuelExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const expense = await FuelExpenseService.createFuelExpense(req.user.id, req.body);
  res.status(201).json({ success: true, data: expense });
};

export const getFuelExpensesByVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const expenses = await FuelExpenseService.getFuelExpensesByVehicle(String(req.params.vehicleId), req.user.id);
  res.json({ success: true, data: expenses });
};

export const getFuelExpenseById = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const expense = await FuelExpenseService.getFuelExpenseById(String(req.params.id), req.user.id);
  res.json({ success: true, data: expense });
};

export const updateFuelExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const expense = await FuelExpenseService.updateFuelExpense(String(req.params.id), req.user.id, req.body);
  res.json({ success: true, data: expense });
};

export const deleteFuelExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  await FuelExpenseService.deleteFuelExpense(String(req.params.id), req.user.id);
  res.json({ success: true, message: "Fuel expense record deleted successfully" });
};
