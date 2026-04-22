import mongoose, { Schema, models, model } from "mongoose";

const AdminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["SUPER_ADMIN", "ADMIN"], required: true, default: "ADMIN" },
    status: { type: String, enum: ["ACTIVE", "DISABLED"], default: "ACTIVE" },
    lastLogin: { type: String, default: "" }
  },
  { timestamps: true }
);

export default models.Admin || model("Admin", AdminSchema);
