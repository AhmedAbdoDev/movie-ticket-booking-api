import { Request, Response } from "express";

import {
  createShowtime,
  getShowtimeById,
  getAllShowtimes,
  updateShowtime,
  deleteShowtime,
  getAvailableSeats,
} from "./showtime.service";

export const createShowtimeController = async (req: Request, res: Response) => {
  const result = await createShowtime(req.body);

  res.status(201).json({
    success: true,
    message: "Showtime created successfully",
    data: result,
  });
};

export const getAllShowtimesController = async (
  req: Request,
  res: Response,
) => {
  const result = await getAllShowtimes();

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const getShowtimeByIdController = async (
  req: Request,
  res: Response,
) => {
  const id = req.params.id as string;
  const result = await getShowtimeById(id);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const updateShowtimeController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await updateShowtime(id, req.body);

  res.status(200).json({
    success: true,
    message: "Showtime updated successfully",
    data: result,
  });
};

export const deleteShowtimeController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await deleteShowtime(id);

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const getAvailableSeatsController = async (
  req: Request,
  res: Response,
) => {
  const id = req.params.id as string;
  const result = await getAvailableSeats(id);

  res.status(200).json(result);
};
