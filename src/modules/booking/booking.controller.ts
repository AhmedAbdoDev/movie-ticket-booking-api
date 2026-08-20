import { Request, Response } from "express";
import {
  GetBookings,
  CreateBooking,
  GetAllBookings,
  GetBookingById,
  CancelBooking,
} from "./booking.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const getBookingsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const customerId = req.user!.id;
  const result = await GetBookings(
    customerId,
    req.query.page as number | undefined,
    req.query.limit as number | undefined,
  );
  res.status(200).json({
    success: true,
    ...result,
  });
};

export const createBookingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const customerId = req.user!.id;
  const result = await CreateBooking(customerId, req.body);

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

export const getBookingByIdController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const customerId = req.user!.id;
  const result = await GetBookingById(customerId, req.params.id as string);

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const cancelBookingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const customerId = req.user!.id;
  const result = await CancelBooking(customerId, req.params.id as string);

  res.status(200).json({
    success: true,
    ...result,
  });
};
