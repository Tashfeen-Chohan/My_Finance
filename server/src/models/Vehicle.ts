import mongoose, { Document, Schema } from "mongoose";

export interface IVehicle extends Omit<Document, "model"> {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  make: string;
  model: string;
  year?: number;
  licensePlate?: string;
  fuelType: "petrol" | "diesel" | "electric" | "hybrid" | "cng" | "other";
  mileageUnit: "km" | "miles";
  isDefault: boolean;
  initialOdometer: number;
  currentOdometer: number;
  photoUrl?: string;
  notes?: string;
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  // Soft delete
  isDeleted: boolean;
  deletedAt?: Date | null;
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
    fuelType: {
      type: String,
      enum: {
        values: ["petrol", "diesel", "electric", "hybrid", "cng", "other"],
        message: "{VALUE} is not a valid fuel type",
      },
      default: "petrol",
      required: true,
    },
    mileageUnit: {
      type: String,
      enum: ["km", "miles"],
      default: "km",
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
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
    photoUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
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

// Essential index for querying user vehicles
VehicleSchema.index({ userId: 1, isDeleted: 1 });

export const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);
