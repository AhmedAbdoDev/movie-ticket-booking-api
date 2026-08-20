import { Request, Response } from "express";
import {
  CreateMovie,
  GetMovies,
  GetMovieById,
  UpdateMovie,
  DeleteMovie,
} from "./movie.service";

export const createMovieController = async (req: Request, res: Response) => {
  const result = await CreateMovie(req.body);
  res.status(201).json({ success: true, ...result });
};

export const getMoviesController = async (req: Request, res: Response) => {
  const result = await GetMovies(req.query as any);
  res.status(200).json({ success: true, ...result });
};

export const getMovieByIdController = async (req: Request, res: Response) => {
  const result = await GetMovieById(req.params.id as string);
  res.status(200).json({ success: true, ...result });
};

export const updateMovieController = async (req: Request, res: Response) => {
  const result = await UpdateMovie(req.params.id as string, req.body);
  res.status(200).json({ success: true, ...result });
};

export const deleteMovieController = async (req: Request, res: Response) => {
  const result = await DeleteMovie(req.params.id as string);
  res.status(200).json({ success: true, ...result });
};
