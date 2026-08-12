import { Request, Response, NextFunction } from "express";
import AppError from "../error/AppError";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.status).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
    return;
  }
  console.error("Unexpected error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
