import AppError from "../../error/AppError";
import movieModel from "../../models/movie.model";
import showtimeModel from "../../models/showtime.model";
import { paginate } from "../../utils/pagination";
import { timeToMinutes } from "../../utils/time";

export const CreateMovie = async (data: any) => {
  const movie = await movieModel.create(data);
  return { data: movie };
};

export const GetMovies = async (query: {
  page?: number;
  limit?: number;
  title?: string;
  genre?: string;
  status?: "NOW_SHOWING" | "COMING_SOON";
  date?: string;
  showtime?: string;
}) => {
  const { page, limit, title, genre, status, date, showtime } = query;
  const filter: any = {};

  if (title) filter.title = { $regex: title, $options: "i" };
  if (genre) filter.genre = { $regex: genre, $options: "i" };
  if (status) filter.status = status;

  if (date || showtime) {
    const showtimeFilter: any = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      showtimeFilter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (showtime) {
      const minutes = showtime.includes(":")
        ? timeToMinutes(showtime)
        : Number(showtime);
      showtimeFilter.startTime = minutes;
    }

    const matchingShowtimes = await showtimeModel
      .find(showtimeFilter)
      .select("movie");
    const movieIds = matchingShowtimes.map((st: any) => st.movie);
    filter._id = { $in: movieIds };
  }

  return paginate(movieModel, filter, { page, limit });
};

export const GetMovieById = async (id: string) => {
  const movie = await movieModel.findById(id);
  if (!movie) throw new AppError("Movie not found", 404);
  return { data: movie };
};

export const UpdateMovie = async (id: string, data: any) => {
  const movie = await movieModel.findByIdAndUpdate(id, data, { new: true });
  if (!movie) throw new AppError("Movie not found", 404);
  return { data: movie };
};

export const DeleteMovie = async (id: string) => {
  const movie = await movieModel.findByIdAndDelete(id);
  if (!movie) throw new AppError("Movie not found", 404);
  return { message: "Movie deleted successfully" };
};
