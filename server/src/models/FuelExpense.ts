import mongoose, { Document, Schema } from "mongoose";

export interface IFuelExpense extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  vehicleId: mongoose.Types.ObjectId | string;
  date: Date;
  odometer: number;
  distanceTraveled?: number;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  isFullTank: boolean;
  computedEconomy?: number;
  costPerKM?: number;
  dailyDistanceDriven?: number;
  isLocked: boolean;
  stationName?: string;
  notes?: string;
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId | string;
  updatedBy?: mongoose.Types.ObjectId | string;
  // Soft delete
  isDeleted: boolean;
  deletedAt?: Date | null;
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
    isFullTank: {
      type: Boolean,
      default: true,
    },
    computedEconomy: {
      type: Number,
      min: [0, "Fuel economy cannot be negative"],
    },
    costPerKM: {
      type: Number,
      min: [0, "Cost per kilometer cannot be negative"],
    },
    dailyDistanceDriven: {
      type: Number,
      min: [0, "Daily distance driven cannot be negative"],
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    stationName: {
      type: String,
      trim: true,
      maxlength: [100, "Station name cannot exceed 100 characters"],
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

// Pre-save hook: compute totalCost if omitted
FuelExpenseSchema.pre<IFuelExpense>("save", function (next) {
  if (!this.totalCost && this.quantity && this.unitPrice) {
    this.totalCost = Number((this.quantity * this.unitPrice).toFixed(2));
  }
  next();
});

// Essential indexes for query performance
FuelExpenseSchema.index({ vehicleId: 1, date: -1, isDeleted: 1 });
FuelExpenseSchema.index({ userId: 1, date: -1, isDeleted: 1 });

export const FuelExpense = mongoose.model<IFuelExpense>("FuelExpense", FuelExpenseSchema);
