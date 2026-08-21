import { Model, PopulateOptions } from "mongoose";
import z from "zod";

interface PaginationOptions {
  page?: number;
  limit?: number;
  populate?: string | PopulateOptions | (string | PopulateOptions)[];
  sort?: Record<string, 1 | -1> | null;
}

export const paginate = async <T>(
  model: Model<T> | any,
  filter: Record<string, unknown> = {},
  options: PaginationOptions = {},
) => {
  const page = Number(options.page && options.page > 0 ? options.page : 1);
  const limit =
    options.limit && options.limit > 0 ? Math.min(options.limit, 100) : 10;
  const skip = (page - 1) * limit;
  const sort = options.sort ?? { _id: -1 };

  let query = model.find(filter).skip(skip).limit(limit).sort(sort);

  if (options.populate) query = query.populate(options.populate);

  const [data, total] = await Promise.all([
    query,
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .int("Page must be an integer")
      .min(1, "Page must be at least 1")
      .optional()
      .default(1),
    limit: z.coerce
      .number()
      .int("Limit must be an integer")
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .optional()
      .default(1),
  }),
});
