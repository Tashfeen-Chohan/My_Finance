import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  refreshToken?: string;
  preferences: {
    currency: string;
    distanceUnit: "km" | "miles";
    fuelUnit: "liters" | "gallons";
    theme: "light" | "dark" | "system";
  };
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
  clientSyncId?: string;
  lastSyncedAt: Date;
  version: number;
}

const UserSchema: Schema = new Schema(
  {
    googleId: {
      type: String,
      required: [true, "Google ID is required"],
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
      select: false, // Hidden by default for security
    },
    preferences: {
      currency: {
        type: String,
        default: "PKR",
        uppercase: true,
        trim: true,
        maxlength: 5,
      },
      distanceUnit: {
        type: String,
        enum: ["km", "miles"],
        default: "km",
      },
      fuelUnit: {
        type: String,
        enum: ["liters", "gallons"],
        default: "liters",
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
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
      sparse: true,
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
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

// Compound indexes for performant querying
UserSchema.index({ email: 1, isDeleted: 1 });
UserSchema.index({ googleId: 1, isDeleted: 1 });
UserSchema.index({ updatedAt: 1, isDeleted: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
