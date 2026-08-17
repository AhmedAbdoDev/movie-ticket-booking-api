import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const selectedSeatsSchema = z
  .array(z.string().trim().min(1, "Seat number cannot be empty"))
  .min(1, "At least one seat must be selected")
  .refine((seats) => new Set(seats).size === seats.length, {
    message: "Duplicate seats are not allowed",
  });

const bookingIdParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    showtimeId: objectIdSchema,
    selectedSeats: selectedSeatsSchema,
  }),
});

export const getBookingsSchema = paginationSchema;

export const getAllBookingsSchema = paginationSchema;

export const getBookingByIdSchema = bookingIdParamsSchema;

export const cancelBookingSchema = bookingIdParamsSchema;
