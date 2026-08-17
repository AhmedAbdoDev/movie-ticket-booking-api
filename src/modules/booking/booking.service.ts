import AppError from "../../error/AppError";
import bookingModel from "../../models/booking.model";
import showtimeModel from "../../models/showtime.model";
import "../../models/user.model";
import "../../models/movie.model";
import { paginate } from "../../utils/pagination";
import { combineDateAndMinutes } from "../../utils/time";
import {
  acquireBookingLock,
  releaseBookingLock,
} from "../../utils/bookingLock";

const MOCK_CUSTOMER_ID = "6a8324514631dd6dd2dc21e4";

export const GetBookings = async (page?: number, limit?: number) => {
  return paginate(
    bookingModel,
    { customer: MOCK_CUSTOMER_ID },
    {
      page,
      limit,
      populate: [{ path: "showtime", populate: { path: "movie" } }],
    },
  );
};

export const CreateBooking = async (data: {
  showtimeId: string;
  selectedSeats: string[];
}) => {
  const { showtimeId, selectedSeats } = data;
  const lockAcquired = acquireBookingLock(showtimeId);

  if (!lockAcquired)
    throw new AppError(
      "Another booking is currently being processed for this showtime",
      409,
    );
  try {
    const showtime = await showtimeModel.findById(showtimeId);
    if (!showtime) throw new AppError("Showtime not found", 404);

    const showtimeStart = combineDateAndMinutes(
      showtime.date,
      showtime.startTime,
    );

    if (showtimeStart <= new Date())
      throw new AppError(
        "Cannot book tickets for a showtime that has already started",
        400,
      );

    const activeBookings = await bookingModel.find({
      showtime: showtimeId,
      bookingStatus: {
        $ne: "CANCELLED",
      },
    });

    const bookedSeats = activeBookings.flatMap(
      (booking) => booking.selectedSeats,
    );

    const alreadyBookedSeats = selectedSeats.filter((seat) =>
      bookedSeats.includes(seat),
    );

    if (alreadyBookedSeats.length > 0)
      throw new AppError(
        `The following seats are already booked: ${alreadyBookedSeats.join(", ")}`,
        409,
      );

    const totalBookedSeats = bookedSeats.length;
    const requestedSeatsCount = selectedSeats.length;

    if (totalBookedSeats + requestedSeatsCount > showtime.totalCapacity)
      throw new AppError("Booking exceeds the available hall capacity", 409);

    const totalPrice = selectedSeats.length * showtime.ticketPrice;

    const booking = await bookingModel.create({
      customer: MOCK_CUSTOMER_ID,
      showtime: showtimeId,
      selectedSeats,
      totalPrice,
      bookingStatus: "CONFIRMED",
    });

    return {
      data: booking,
    };
  } finally {
    releaseBookingLock(showtimeId);
  }
};

export const GetAllBookings = async (page?: number, limit?: number) => {
  return paginate(
    bookingModel,
    {},
    {
      page,
      limit,
      populate: [
        {
          path: "customer",
          select: "_id fullName email role",
        },
        {
          path: "showtime",
          populate: {
            path: "movie",
          },
        },
      ],
    },
  );
};

export const GetBookingById = async (id: string) => {
  const booking = await bookingModel
    .findOne({
      customer: MOCK_CUSTOMER_ID,
      _id: id,
    })
    .populate({ path: "showtime", populate: { path: "movie" } });
  if (!booking) throw new AppError("Booking not found", 404);
  return {
    data: booking,
  };
};

export const CancelBooking = async (id: string) => {
  const booking = await bookingModel.findOne({
    customer: MOCK_CUSTOMER_ID,
    _id: id,
  });

  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.bookingStatus === "CANCELLED")
    throw new AppError("Can't cancel an already cancelled booking", 409);

  const showtime = await showtimeModel.findById(booking.showtime);
  if (!showtime) throw new AppError("Showtime not found", 404);

  const showtimeStart = combineDateAndMinutes(
    showtime.date,
    showtime.startTime,
  );
  if (showtimeStart <= new Date())
    throw new AppError(
      "Cannot cancel booking after the movie has started",
      409,
    );

  booking.bookingStatus = "CANCELLED";
  await booking.save();

  return {
    message: "Booking cancelled successfully",
  };
};
