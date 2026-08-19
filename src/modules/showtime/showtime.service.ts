import { Request, Response } from "express";
import { minutesToTime } from "../../utils/time";
import showtimeModel from "../../models/showtime.model";
import moviemodel from "../../models/movie.model";
import AppError from "../../error/AppError";
import { paginate } from "../../utils/pagination";
import bookingModel from "../../models/booking.model";


type CreateShowtimeData = {
  movie: string;
  hallNumber: number;
  date: string | Date;
  startTime: number;
  endTime: number;
  ticketPrice: number;
  totalCapacity: number;
};


export const createShowtime = async (data: CreateShowtimeData,) => {
 
  const movieExists = await moviemodel.findById(data.movie);

  if (!movieExists) {
    throw new AppError("Movie not found", 404);
  }

  if (data.startTime >= data.endTime) {
    throw new AppError(
      "Start time must be before end time",400,
    );
  }

  const existingShowtimes = await showtimeModel.find({
    hallNumber: data.hallNumber,
    date: data.date,
  });

  const hasConflict = existingShowtimes.some((existingShowtime) => {
    const isBefore =
      data.endTime <= existingShowtime.startTime;
    const isAfter =
      data.startTime >= existingShowtime.endTime;
    return !isBefore && !isAfter;
  });

  if (hasConflict) {
    throw new AppError(
      "There is already a showtime scheduled in this hall at this time",409,
    );
  }

  const showtime = await showtimeModel.create({
    movie: data.movie,
    hallNumber: data.hallNumber,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    ticketPrice: data.ticketPrice,
    totalCapacity: data.totalCapacity,
  });

  return {
    data: {
      ...showtime.toObject(),
      startTime: minutesToTime(showtime.startTime),
      endTime: minutesToTime(showtime.endTime),
    },
  };
};


export const getAllShowtimes = async (
  page?: number,
  limit?: number,
) => {
  const result = await paginate(
    showtimeModel,
    {},
    {
      page,
      limit,
      populate: "movie",
    },
  );

  const data = result.data.map((showtime: any) => ({
    ...showtime.toObject(),
    startTime: minutesToTime(showtime.startTime),
    endTime: minutesToTime(showtime.endTime),
  }));

  return {
    data,
    pagination: result.pagination,
  };
};
 
export const getShowtimeById = async (id: string) => {
  const showtime = await showtimeModel.findById(id).populate("movie");
  if (!showtime)
     throw new AppError("Showtime not found", 404);
    
return {
    ...showtime.toObject(),
    startTime: minutesToTime(showtime.startTime),
    endTime: minutesToTime(showtime.endTime),
  };
}


type UpdateShowtimeData = {
  hallNumber?: number;
  date?: string | Date;
  startTime?: number;
  endTime?: number;
  ticketPrice?: number;
  totalCapacity?: number;
};

export const updateShowtime = async (id: string,data: UpdateShowtimeData,) => {
  
  const showtime = await showtimeModel.findById(id);
  if (!showtime) {
    throw new AppError("Showtime not found", 404);
  }

 

  const hallNumber = data.hallNumber ?? showtime.hallNumber;
  const date = data.date ? new Date(data.date) : showtime.date;
  const startTime = data.startTime ?? showtime.startTime;
  const endTime = data.endTime ?? showtime.endTime;
  const ticketPrice = data.ticketPrice ?? showtime.ticketPrice;
  const totalCapacity = data.totalCapacity ?? showtime.totalCapacity;

  
  if (startTime >= endTime) {
    throw new AppError(
      "Start time must be before end time",
      400,
    );
  }



  const existingShowtimes = await showtimeModel.find({
    _id: { $ne: id },
    hallNumber,
    date,
  });

 
  const hasConflict = existingShowtimes.some((existingShowtime) => {
    const isBefore = endTime <= existingShowtime.startTime;

    const isAfter = startTime >= existingShowtime.endTime;

    return !isBefore && !isAfter;
  });

  if (hasConflict) {
    throw new AppError(
      "There is already a showtime scheduled in this hall at this time", 409,
    );
  }

   
  const activeBookings = await bookingModel.find({
    showtime: id,
    bookingStatus: { $ne: "CANCELLED" },
  });

  const bookedSeatsCount = activeBookings.reduce(
    (total, booking) => total + booking.selectedSeats.length,0,);

  if (totalCapacity < bookedSeatsCount) {
    throw new AppError(
      `Total capacity cannot be less than booked seats (${bookedSeatsCount})`,409,
    );
}    
  
  showtime.hallNumber = hallNumber;
  showtime.date = date;
  showtime.startTime = startTime;
  showtime.endTime = endTime;
  showtime.ticketPrice = ticketPrice;
  showtime.totalCapacity = totalCapacity;
  
  await showtime.save();

  return {
    data: {
      ...showtime.toObject(),
      startTime: minutesToTime(showtime.startTime),
      endTime: minutesToTime(showtime.endTime),
    },
  };
};


export const deleteShowtime = async (id: string) => {
  const showtime = await showtimeModel.findById(id);

  if (!showtime) {
    throw new AppError("Showtime not found", 404);
  }

  const activeBookings = await bookingModel.find({
    showtime: id,
    bookingStatus: {
      $in: ["PENDING", "CONFIRMED"],
    },
  });

  if (activeBookings.length > 0) {
    throw new AppError(
      "Cannot delete a showtime that has active bookings",
      409,
    );
  }

  await showtimeModel.findByIdAndDelete(id);

  return {
    message: "Showtime deleted successfully",
  };
};