import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const movieIdParamsSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

export const createMovieSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim(),
    genre: z.string().min(1, "Genre is required").trim(),
    duration: z.number().min(1, "Duration must be at least 1 minute"),
    description: z.string().min(1, "Description is required").trim(),
    posterUrl: z.string().url("Must be a valid URL").trim(),
    rating: z.number().min(0).max(10),
    status: z.enum(["NOW_SHOWING", "COMING_SOON"]),
  }),
});

export const updateMovieSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: createMovieSchema.shape.body.partial(),
});

export const getMoviesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    title: z.string().trim().optional(),
    genre: z.string().trim().optional(),
    status: z.enum(["NOW_SHOWING", "COMING_SOON"]).optional(),
    date: z.string().optional(),
    showtime: z.string().optional(),
  }),
});