import mongoose, { Document, Schema } from "mongoose";

export interface IVehicle extends Omit<Document, "model"> {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  make: string;
  model: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  fuelType: "petrol" | "diesel" | "electric" | "hybrid" | "cng" | "other";
  initialOdometer: number;
  currentOdometer: number;
  currency: string;
  isActive: boolean;
  photoUrl?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  // Soft delete
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  // Offline sync metadata
  clientSyncId: string;
  lastSyncedAt: Date;
  version: number;
}

const VehicleSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vehicle must belong to a user"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
      maxlength: [100, "Vehicle name cannot exceed 100 characters"],
    },
    make: {
      type: String,
      required: [true, "Vehicle make is required (e.g. Honda, Toyota)"],
      trim: true,
      maxlength: [50, "Make cannot exceed 50 characters"],
    },
    model: {
      type: String,
      required: [true, "Vehicle model is required (e.g. Civic, Corolla)"],
      trim: true,
      maxlength: [50, "Model cannot exceed 50 characters"],
    },
    year: {
      type: Number,
      min: [1900, "Year must be 1900 or later"],
      max: [new Date().getFullYear() + 2, "Year cannot be in the far future"],
    },
    licensePlate: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, "License plate cannot exceed 20 characters"],
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [30, "VIN cannot exceed 30 characters"],
    },
    fuelType: {
      type: String,
      enum: {
        values: ["petrol", "diesel", "electric", "hybrid", "cng", "other"],
        message: "{VALUE} is not a valid fuel type",
      },
      default: "petrol",
      required: true,
    },
    initialOdometer: {
      type: Number,
      required: [true, "Initial odometer reading is required"],
      min: [0, "Initial odometer cannot be negative"],
      default: 0,
    },
    currentOdometer: {
      type: Number,
      required: [true, "Current odometer reading is required"],
      min: [0, "Current odometer cannot be negative"],
      default: 0,
    },
    currency: {
      type: String,
      default: "PKR",
      uppercase: true,
      trim: true,
      maxlength: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    // Audit fields
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Offline sync metadata
    clientSyncId: {
      type: String,
      required: [true, "Client sync ID is required for offline sync"],
      trim: true,
      index: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Validation pre-hook: currentOdometer >= initialOdometer
VehicleSchema.pre<IVehicle>("save", function (next) {
  if (this.currentOdometer < this.initialOdometer) {
    return next(new Error("Current odometer reading cannot be less than initial odometer reading"));
  }
  next();
});

// Indexes for offline sync, soft delete filtering, and performant user queries
VehicleSchema.index({ userId: 1, isDeleted: 1 });
VehicleSchema.index({ userId: 1, clientSyncId: 1 }, { unique: true });
VehicleSchema.index({ userId: 1, isActive: 1, isDeleted: 1 });
VehicleSchema.index({ updatedAt: 1, isDeleted: 1 });

export const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);
