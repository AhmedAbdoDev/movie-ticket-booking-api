import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import AppError from "../error/AppError";

type ValidationData = {
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
};

export const validate = <T extends ValidationData>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (result.body) req.body = result.body;

      if (result.params) req.params = result.params;

      if (result.query) {
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, result.query);
      }

      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue) => `${issue.path.join(":")} : ${issue.message}`)
          .join(",");
        return next(new AppError(message, 422));
      }

      if (error instanceof Error) return next(new AppError(error.message, 422));
      next(new AppError("Validation error", 422));
    }
  };
};

export default validate;
