import { BaseRepository } from "./baseRepository";
import { Vehicle, IVehicle } from "../models/Vehicle";

export class VehicleRepository extends BaseRepository<IVehicle> {
  constructor() {
    super(Vehicle);
  }

  async findByUserId(userId: string): Promise<IVehicle[]> {
    return await this.find({ userId });
  }

  async updateOdometer(vehicleId: string, newOdometer: number): Promise<void> {
    await Vehicle.updateOne(
      { _id: vehicleId, currentOdometer: { $lt: newOdometer } },
      { $set: { currentOdometer: newOdometer } }
    );
  }
}

export const vehicleRepository = new VehicleRepository();
