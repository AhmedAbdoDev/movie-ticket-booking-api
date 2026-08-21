import AppError from "../error/AppError";

export const isValidSeatFormat = (seat: string): boolean => {
  return /^seat([1-9][0-9]*)$/.test(seat);
};

export const validateSeats = (
  seats: string[],
  totalCapacity: number,
): void => {
  for (const seat of seats) {
    if (!isValidSeatFormat(seat)) {
      throw new AppError(
        `Invalid seat format: ${seat}`,400,
      );
    }


    const seatNumber = Number(seat.replace("seat", ""));

    if (seatNumber > totalCapacity) {
      throw new AppError(
        `Seat ${seat} is outside the showtime capacity`,400,
      );
    }
  }
};