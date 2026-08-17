import { Schema, model } from "mongoose";

const Movie = new Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, trim: true },
    posterUrl: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    status: {
      type: String,
      enum: ["NOW_SHOWING", "COMING_SOON"],
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export default model("movie", Movie);
