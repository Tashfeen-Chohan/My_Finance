import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createVehicle as createVehicleService,
  getUserVehicles as getUserVehiclesService,
  getVehicleById as getVehicleByIdService,
  getDefaultVehicle as getDefaultVehicleService,
  updateVehicle as updateVehicleService,
  setDefaultVehicle as setDefaultVehicleService,
  deleteVehicle as deleteVehicleService,
} from "../services/vehicleService";
import { UnauthorizedError } from "../errors/ApiError";

export const createVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicle = await createVehicleService(req.user.id, req.body);
  res.status(201).json({ success: true, data: vehicle });
};

export const getVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicles = await getUserVehiclesService(req.user.id);
  res.json({ success: true, data: vehicles });
};

export const getDefaultVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicle = await getDefaultVehicleService(req.user.id);
  res.json({ success: true, data: vehicle });
};

export const getVehicleById = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicle = await getVehicleByIdService(String(req.params.id), req.user.id);
  res.json({ success: true, data: vehicle });
};

export const updateVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicle = await updateVehicleService(String(req.params.id), req.user.id, req.body);
  res.json({ success: true, data: vehicle });
};

export const setDefaultVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicle = await setDefaultVehicleService(String(req.params.id), req.user.id);
  res.json({ success: true, data: vehicle });
};

export const deleteVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  await deleteVehicleService(String(req.params.id), req.user.id);
  res.json({ success: true, message: "Vehicle deleted successfully" });
};
