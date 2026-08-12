import { Schema, model } from "mongoose";

const Showtime = new Schema(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },
    hallNumber: { type: Number, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    totalCapacity: { type: Number, required: true, min: 1 },
  },
  { versionKey: false },
);

export default model("showtime", Showtime);
