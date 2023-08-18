import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    city: String,
    state: String,
    country: String,
    occupation: String,
    phoneNumber: String,
    // transactions: Array,
    type: {
      type: String,
      enum: ["2D (APM)", "2D (APM2)", "S2S", "HPP"],
      default: "HPP",
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    apiKey: String,
    role: {
      type: String,
      enum: ["merchant", "admin", "superadmin"],
      default: "merchant",
    },
    status: {
      type: String,
      enum: ["activated", "deactivated"],
      default: "activated",
    },
    mode: {
      type: String,
      enum: ["test", "live"],
      default: "test",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;