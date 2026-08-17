import { Schema, model } from "mongoose";

const Booking = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    showtime: {
      type: Schema.Types.ObjectId,
      ref: "showtime",
      required: true,
    },
    selectedSeats: {
      type: [String],
      required: true,
      validate: {
        validator: (seats: string[]) => seats.length > 0,
        message: "At least one seat must be selected",
      },
    },
    totalPrice: { type: Number, required: true, min: 0 },
    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export default model("booking", Booking);
