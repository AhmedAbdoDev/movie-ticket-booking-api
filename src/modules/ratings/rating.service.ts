import AppError from "../../error/AppError";
import movieModel from "../../models/movie.model";
import showtimeModel from "../../models/showtime.model";
import ratingModel from "../../models/rating.model";
import { paginate } from "../../utils/pagination";
import bookingModel from "../../models/booking.model";
import { Types } from "mongoose";

export const updateMovieRatingStats = async (movieId: string) => {
  const [stats] = await ratingModel.aggregate([
    { $match: { movie: new Types.ObjectId(movieId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  await movieModel.findByIdAndUpdate(movieId, {
    averageRating: stats ? Math.round(stats.averageRating * 10) / 10 : 0,
    totalRatings: stats?.totalRatings ?? 0,
  });
};

export const CreateRating = async (data: {
  customerId: string;
  movieId: string;
  rating: number;
  review?: string;
}) => {
  const { customerId, movieId, rating, review } = data;

  const movie = await movieModel.findOne({
    _id: movieId,
    isDeleted: false,
  });

  if (!movie) throw new AppError("Movie not found", 404);

  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const attendedShowtimes = await showtimeModel
    .find({
      movie: movieId,
      $or: [
        { date: { $lt: todayStart } },
        {
          date: {
            $gte: todayStart,
            $lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000),
          },
          endTime: { $lte: currentMinutes },
        },
      ],
    })
    .select("_id");

  const showtimeIds = attendedShowtimes.map((showtime) => showtime._id);

  if (showtimeIds.length === 0)
    throw new AppError("Can't rate a movie you didn't attend yet", 400);

  const booked = await bookingModel.findOne({
    customer: customerId,
    showtime: { $in: showtimeIds },
    bookingStatus: "CONFIRMED",
  });

  if (!booked)
    throw new AppError("You can only rate a movie after attending it", 403);

  const existingRating = await ratingModel.findOne({
    customer: customerId,
    movie: movieId,
  });

  if (existingRating)
    throw new AppError("You have already rated this movie", 409);

  const ratingData = await ratingModel.create({
    customer: customerId,
    movie: movieId,
    rating,
    review,
  });

  await updateMovieRatingStats(movieId);

  return {
    data: ratingData,
  };
};

export const GetMovieRatings = async (
  movieId: string,
  query: { page?: number; limit?: number },
) => {
  const movie = await movieModel.findOne({ _id: movieId, isDeleted: false });
  if (!movie) throw new AppError("Movie not found", 404);

  return paginate(
    ratingModel,
    { movie: movieId },
    {
      page: query.page,
      limit: query.limit,
      populate: { path: "customer", select: "_id fullName" },
    },
  );
};

export const GetMyRatings = async (
  customerId: string,
  query: {
    page?: number;
    limit?: number;
  },
) => {
  const { page, limit } = query;

  return paginate(
    ratingModel,
    {
      customer: customerId,
    },
    {
      page,
      limit,
      populate: "movie",
    },
  );
};

export const DeleteRating = async (
  id: string,
  userId: string,
  role: string,
) => {
  const rating = await ratingModel.findById(id);

  if (!rating) throw new AppError("Rating not found", 404);

  if (role === "CUSTOMER" && rating.customer.toString() !== userId)
    throw new AppError("You can only delete your own rating", 403);

  const movieId = rating.movie.toString();
  await ratingModel.findByIdAndDelete(id);
  await updateMovieRatingStats(movieId);

  return {
    message: "Rating deleted successfully",
  };
};
