import mongoose, { Document, Schema } from "mongoose";

export interface IMaintenanceExpense extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  date: Date;
  odometer: number;
  category: string;
  title: string;
  description?: string;
  cost: number;
  serviceProvider?: string;
  receiptUrl?: string;
  nextServiceOdometer?: number;
  nextServiceOdometerMin?: number;
  nextServiceOdometerMax?: number;
  nextOilChangeOdometer?: number;
  nextOilChangeOdometerMin?: number;
  nextOilChangeOdometerMax?: number;
  notes?: string;
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  // Soft delete
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
}

const MaintenanceExpenseSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Maintenance expense must belong to a user"],
      index: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Maintenance expense must belong to a vehicle"],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date of service/maintenance is required"],
      default: Date.now,
      index: true,
    },
    odometer: {
      type: Number,
      required: [true, "Odometer reading is required"],
      min: [0, "Odometer reading cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Maintenance category is required"],
      trim: true,
      default: "service",
      index: true,
    },
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: [0, "Cost cannot be negative"],
    },
    serviceProvider: {
      type: String,
      trim: true,
      maxlength: [100, "Service provider name cannot exceed 100 characters"],
    },
    receiptUrl: {
      type: String,
      trim: true,
    },
    nextServiceOdometer: {
      type: Number,
      min: [0, "Next service odometer cannot be negative"],
    },
    nextServiceOdometerMin: {
      type: Number,
      min: [0, "Next service odometer min cannot be negative"],
    },
    nextServiceOdometerMax: {
      type: Number,
      min: [0, "Next service odometer max cannot be negative"],
    },
    nextOilChangeOdometer: {
      type: Number,
      min: [0, "Next oil change odometer cannot be negative"],
    },
    nextOilChangeOdometerMin: {
      type: Number,
      min: [0, "Next oil change odometer min cannot be negative"],
    },
    nextOilChangeOdometerMax: {
      type: Number,
      min: [0, "Next oil change odometer max cannot be negative"],
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

// Essential indexes for query performance
MaintenanceExpenseSchema.index({ vehicleId: 1, date: -1, isDeleted: 1 });
MaintenanceExpenseSchema.index({ userId: 1, date: -1, isDeleted: 1 });

export const MaintenanceExpense = mongoose.model<IMaintenanceExpense>("MaintenanceExpense", MaintenanceExpenseSchema);
