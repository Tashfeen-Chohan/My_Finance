export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type UserProfile = User;

export interface Vehicle {
  id: string;
  userId: string;
  name: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  createdAt: string;
  updatedAt: string;
}

export interface FuelExpense {
  id: string;
  userId: string;
  vehicleId: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalAmount: number;
  fuelStation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceExpense {
  id: string;
  userId: string;
  vehicleId: string;
  date: string;
  serviceType: string;
  cost: number;
  odometer: number;
  serviceProvider?: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
