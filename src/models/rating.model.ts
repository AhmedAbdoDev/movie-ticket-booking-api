import { Schema, model } from "mongoose";

const Rating = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
).index({ customer: 1, movie: 1 }, { unique: true });

export default model("rating", Rating);
