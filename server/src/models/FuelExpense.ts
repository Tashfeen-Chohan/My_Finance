import mongoose, { Document, Schema } from "mongoose";

export interface IFuelExpense extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  date: Date;
  odometer: number;
  distanceTraveled?: number;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  fuelType?: string;
  isFullTank: boolean;
  missedPreviousRefill: boolean;
  computedEconomy?: number;
  currency: string;
  stationName?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  notes?: string;
  receiptUrl?: string;
  tags?: string[];
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

const FuelExpenseSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Fuel expense must belong to a user"],
      index: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Fuel expense must belong to a vehicle"],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date of fuel expense is required"],
      default: Date.now,
      index: true,
    },
    odometer: {
      type: Number,
      required: [true, "Odometer reading is required"],
      min: [0, "Odometer reading cannot be negative"],
    },
    distanceTraveled: {
      type: Number,
      min: [0, "Distance traveled cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Fuel quantity is required"],
      min: [0.01, "Fuel quantity must be greater than zero"],
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit price per fuel volume is required"],
      min: [0, "Unit price cannot be negative"],
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Total cost cannot be negative"],
    },
    fuelType: {
      type: String,
      trim: true,
    },
    isFullTank: {
      type: Boolean,
      default: true,
    },
    missedPreviousRefill: {
      type: Boolean,
      default: false,
    },
    computedEconomy: {
      type: Number,
      min: [0, "Fuel economy cannot be negative"],
    },
    currency: {
      type: String,
      default: "PKR",
      uppercase: true,
      trim: true,
      maxlength: 5,
    },
    stationName: {
      type: String,
      trim: true,
      maxlength: [100, "Station name cannot exceed 100 characters"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        validate: {
          validator: (val: number[]) => !val || (val.length === 2 && val[0] >= -180 && val[0] <= 180 && val[1] >= -90 && val[1] <= 90),
          message: "Coordinates must be [longitude, latitude] within valid ranges",
        },
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    receiptUrl: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
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

// Pre-save hook: compute totalCost if omitted or set to zero
FuelExpenseSchema.pre<IFuelExpense>("save", function (next) {
  if (!this.totalCost && this.quantity && this.unitPrice) {
    this.totalCost = Number((this.quantity * this.unitPrice).toFixed(2));
  }
  next();
});

// Indexes for query performance and sync lookup
FuelExpenseSchema.index({ vehicleId: 1, date: -1, isDeleted: 1 });
FuelExpenseSchema.index({ userId: 1, date: -1, isDeleted: 1 });
FuelExpenseSchema.index({ userId: 1, clientSyncId: 1 }, { unique: true });
FuelExpenseSchema.index({ location: "2dsphere" }, { sparse: true });
FuelExpenseSchema.index({ updatedAt: 1, isDeleted: 1 });

export const FuelExpense = mongoose.model<IFuelExpense>("FuelExpense", FuelExpenseSchema);
