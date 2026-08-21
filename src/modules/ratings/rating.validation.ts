import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const ratingIdParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const createRatingSchema = z.object({
  body: z.object({
    movie: objectIdSchema,
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),
    review: z
      .string()
      .trim()
      .max(1000, "Review cannot exceed 1000 characters")
      .optional(),
  }),
});

export const getMyRatingsSchema = paginationSchema;

export const movieRatingsParamsSchema = z.object({
  params: z.object({ movieId: objectIdSchema }),
  query: paginationSchema.shape.query,
});
