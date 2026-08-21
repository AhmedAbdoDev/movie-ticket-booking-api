import { Schema, model } from "mongoose";

const Movie = new Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, trim: true },
    posterUrl: { type: String, required: true, trim: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["NOW_SHOWING", "COMING_SOON"],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export default model("movie", Movie);
