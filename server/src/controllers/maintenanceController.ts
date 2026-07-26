import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createMaintenance as createMaintenanceService,
  getMaintenanceByVehicle as getMaintenanceByVehicleService,
  getMaintenanceById as getMaintenanceByIdService,
  getUpcomingServices as getUpcomingServicesService,
  updateMaintenance as updateMaintenanceService,
  deleteMaintenance as deleteMaintenanceService,
} from "../services/maintenanceExpenseService";
import { UnauthorizedError } from "../errors/ApiError";

export const createMaintenance = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const record = await createMaintenanceService(req.user.id, req.body);
  res.status(201).json({ success: true, data: record });
};

export const getMaintenanceByVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const records = await getMaintenanceByVehicleService(String(req.params.vehicleId), req.user.id);
  res.json({ success: true, data: records });
};

export const getMaintenanceById = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const record = await getMaintenanceByIdService(String(req.params.id), req.user.id);
  res.json({ success: true, data: record });
};

export const getUpcomingServices = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const upcoming = await getUpcomingServicesService(req.user.id);
  res.json({ success: true, data: upcoming });
};

export const updateMaintenance = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const record = await updateMaintenanceService(String(req.params.id), req.user.id, req.body);
  res.json({ success: true, data: record });
};

export const deleteMaintenance = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  await deleteMaintenanceService(String(req.params.id), req.user.id);
  res.json({ success: true, message: "Maintenance record deleted successfully" });
};
