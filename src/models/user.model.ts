import { Schema, model } from "mongoose";

const User = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["CINEMA_ADMIN", "CUSTOMER"],
      required: true,
    },
  },
  { versionKey: false },
);

export default model("user", User);
