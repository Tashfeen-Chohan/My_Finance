import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { MaintenanceExpenseService } from "../services/maintenanceExpenseService";
import { UnauthorizedError } from "../errors/ApiError";

export const createMaintenance = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const record = await MaintenanceExpenseService.createMaintenance(req.user.id, req.body);
  res.status(201).json({ success: true, data: record });
};

export const getMaintenanceByVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const records = await MaintenanceExpenseService.getMaintenanceByVehicle(String(req.params.vehicleId), req.user.id);
  res.json({ success: true, data: records });
};

export const getMaintenanceById = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const record = await MaintenanceExpenseService.getMaintenanceById(String(req.params.id), req.user.id);
  res.json({ success: true, data: record });
};

export const getUpcomingServices = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const upcoming = await MaintenanceExpenseService.getUpcomingServices(req.user.id);
  res.json({ success: true, data: upcoming });
};

export const updateMaintenance = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const record = await MaintenanceExpenseService.updateMaintenance(String(req.params.id), req.user.id, req.body);
  res.json({ success: true, data: record });
};

export const deleteMaintenance = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  await MaintenanceExpenseService.deleteMaintenance(String(req.params.id), req.user.id);
  res.json({ success: true, message: "Maintenance record deleted successfully" });
};
