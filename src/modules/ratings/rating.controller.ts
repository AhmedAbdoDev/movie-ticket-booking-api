import { Request, Response } from "express";

import {
  CreateRating,
  GetMyRatings,
  GetMovieRatings,
  DeleteRating,
} from "./rating.service";

import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const createRatingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const result = await CreateRating({
    customerId: req.user!.id,
    movieId: req.body.movie,
    rating: req.body.rating,
    review: req.body.review,
  });

  res.status(201).json({
    success: true,
    ...result,
  });
};

export const getMyRatingsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const result = await GetMyRatings(
    req.user!.id,
    req.query as {
      page?: number;
      limit?: number;
    },
  );

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const getMovieRatingsController = async (
  req: Request,
  res: Response,
) => {
  const result = await GetMovieRatings(
    req.params.movieId as string,
    req.query as { page?: number; limit?: number },
  );

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const deleteRatingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const result = await DeleteRating(
    req.params.id as any,
    req.user!.id,
    req.user!.role,
  );

  res.status(200).json({
    success: true,
    ...result,
  });
};
