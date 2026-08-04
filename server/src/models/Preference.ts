import mongoose, { Document, Schema } from "mongoose";
import { DEFAULT_FULL_TANK_DISTANCE, DEFAULT_RESERVE_DISTANCE } from "../constants/preferences";

export interface IPreference extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  fullTankDistance: number;
  reserveDistance: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const PreferenceSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Preference must belong to a user"],
      unique: true,
      index: true,
    },
    fullTankDistance: {
      type: Number,
      required: [true, "Full tank distance is required"],
      min: [1, "Full tank distance must be at least 1 km"],
      default: DEFAULT_FULL_TANK_DISTANCE,
    },
    reserveDistance: {
      type: Number,
      required: [true, "Reserve distance is required"],
      min: [0, "Reserve distance cannot be negative"],
      default: DEFAULT_RESERVE_DISTANCE,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
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

export const Preference = mongoose.model<IPreference>("Preference", PreferenceSchema);
