import { Request, Response } from "express";
import {
  GetBookings,
  CreateBooking,
  GetAllBookings,
  GetBookingById,
  CancelBooking,
} from "./booking.service";

export const getBookingsController = async (req: Request, res: Response) => {
  const result = await GetBookings(
    req.query.page as number | undefined,
    req.query.limit as number | undefined,
  );
  res.status(200).json({
    success: true,
    ...result,
  });
};

export const createBookingController = async (req: Request, res: Response) => {
  const result = await CreateBooking(req.body);

  res.status(201).json({
    success: true,
    ...result,
  });
};

export const getAllBookingsController = async (req: Request, res: Response) => {
  const result = await GetAllBookings(
    req.query.page as number | undefined,
    req.query.limit as number | undefined,
  );

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const getBookingByIdController = async (req: Request, res: Response) => {
  const result = await GetBookingById(req.params.id as string);

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const cancelBookingController = async (req: Request, res: Response) => {
  const result = await CancelBooking(req.params.id as string);

  res.status(200).json({
    success: true,
    ...result,
  });
};
