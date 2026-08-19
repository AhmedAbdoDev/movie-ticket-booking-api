import { Schema, model } from "mongoose";

const Showtime = new Schema(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },
    hallNumber: { 
      type: Number,
      required: true,
      min: 1
    },
    date: { 
      type: Date, 
      required: true
    },
    startTime: {
      type: Number,
      required: true,
      min: 0,
      max: 1439,
    },
    endTime: {
      type: Number,
      required: true,
      min: 0,
      max: 1439,
    },
    ticketPrice: {
       type: Number, 
       required: true,
       min: 1
    },
    totalCapacity: {
       type: Number, 
       required: true, 
       min: 1
    },
  },
  { timestamps: true, versionKey: false },
);

export default model("showtime", Showtime);
