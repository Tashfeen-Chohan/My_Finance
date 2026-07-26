import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { VehicleService } from "../services/vehicleService";
import { UnauthorizedError } from "../errors/ApiError";

export const createVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const vehicle = await VehicleService.createVehicle(req.user.id, req.body);
  res.status(201).json({ success: true, data: vehicle });
};

export const getVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const vehicles = await VehicleService.getUserVehicles(req.user.id);
  res.json({ success: true, data: vehicles });
};

export const getVehicleById = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const vehicle = await VehicleService.getVehicleById(String(req.params.id), req.user.id);
  res.json({ success: true, data: vehicle });
};

export const updateVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const vehicle = await VehicleService.updateVehicle(String(req.params.id), req.user.id, req.body);
  res.json({ success: true, data: vehicle });
};

export const deleteVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  await VehicleService.deleteVehicle(String(req.params.id), req.user.id);
  res.json({ success: true, message: "Vehicle deleted successfully" });
};
