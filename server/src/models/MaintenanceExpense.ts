import mongoose, { Document, Schema } from "mongoose";

export interface IPartItem {
  name: string;
  quantity: number;
  unitCost: number;
  partNumber?: string;
}

export interface IMaintenanceExpense extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  date: Date;
  odometer: number;
  category: string;
  title: string;
  description?: string;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  currency: string;
  serviceProvider?: string;
  nextServiceOdometer?: number;
  nextServiceDate?: Date;
  notes?: string;
  parts?: IPartItem[];
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  // Soft delete
  isDeleted: boolean;
  deletedAt?: Date | null;
  version: number;
}

const PartItemSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Part name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [0.01, "Quantity must be greater than zero"],
    },
    unitCost: {
      type: Number,
      default: 0,
      min: [0, "Unit cost cannot be negative"],
    },
    partNumber: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

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
    partsCost: {
      type: Number,
      default: 0,
      min: [0, "Parts cost cannot be negative"],
    },
    laborCost: {
      type: Number,
      default: 0,
      min: [0, "Labor cost cannot be negative"],
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Total cost cannot be negative"],
    },
    currency: {
      type: String,
      default: "PKR",
      uppercase: true,
      trim: true,
      maxlength: 5,
    },
    serviceProvider: {
      type: String,
      trim: true,
      maxlength: [100, "Service provider name cannot exceed 100 characters"],
    },
    nextServiceOdometer: {
      type: Number,
      min: [0, "Next service odometer cannot be negative"],
    },
    nextServiceDate: {
      type: Date,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    parts: [PartItemSchema],
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

// Pre-save hook: compute totalCost if omitted or set to 0
MaintenanceExpenseSchema.pre<IMaintenanceExpense>("save", function (next) {
  if (!this.totalCost && (this.partsCost !== undefined || this.laborCost !== undefined)) {
    this.totalCost = Number(((this.partsCost || 0) + (this.laborCost || 0)).toFixed(2));
  }
  next();
});

// Essential indexes for query performance and reminder scheduling
MaintenanceExpenseSchema.index({ vehicleId: 1, date: -1, isDeleted: 1 });
MaintenanceExpenseSchema.index({ userId: 1, date: -1, isDeleted: 1 });
MaintenanceExpenseSchema.index({ userId: 1, nextServiceDate: 1, isDeleted: 1 });

export const MaintenanceExpense = mongoose.model<IMaintenanceExpense>("MaintenanceExpense", MaintenanceExpenseSchema);
