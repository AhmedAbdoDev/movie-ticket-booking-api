import { z } from "zod";

const movieSchema = z
  .string("Movie is required")
  .regex(/^[0-9a-fA-F]{24}$/, "Movie must be a valid ObjectId");

const hallNumberSchema = z
  .number("Hall number is required")
  .int("Hall number must be an integer")
  .positive("Hall number must be greater than 0");

const dateSchema = z.coerce.date("Date must be a valid date");

const startTimeSchema = z
  .number("Start time is required")
  .int("Start time must be an integer")
  .min(0, "Start time cannot be less than 0")
  .max(1439, "Start time cannot be greater than 1439");

const endTimeSchema = z
  .number("End time is required")
  .int("End time must be an integer")
  .min(0, "End time cannot be less than 0")
  .max(1439, "End time cannot be greater than 1439");

const ticketPriceSchema = z
  .number("Ticket price is required")
  .positive("Ticket price must be greater than 0");

const totalCapacitySchema = z
  .number("Total capacity is required")
  .int("Total capacity must be an integer")
  .positive("Total capacity must be greater than 0");

export const createShowtimeSchema = z.object({
  body: z
    .object({
      movie: movieSchema,
      hallNumber: hallNumberSchema,
      date: dateSchema,
      startTime: startTimeSchema,
      endTime: endTimeSchema,
      ticketPrice: ticketPriceSchema,
      totalCapacity: totalCapacitySchema,
    })
    .refine((data) => data.startTime < data.endTime, {
      message: "Start time must be before end time",
      path: ["endTime"],
    }),
});

export const getShowtimeByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid showtime ID",
    }),
  }),
});

export const getAllShowtimesSchema = z.object({ query: z.object({}) });

export const deleteShowtimeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid showtime ID",
    }),
  }),
});

export const updateShowtimeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid showtime ID",
    }),
  }),
  body: z.object({
    hallNumber: hallNumberSchema.optional(),
    date: dateSchema.optional(),
    startTime: startTimeSchema.optional(),
    endTime: endTimeSchema.optional(),
    ticketPrice: ticketPriceSchema.optional(),
    totalCapacity: totalCapacitySchema.optional(),
  }),
});

export const getSeatsSchema = deleteShowtimeSchema;
