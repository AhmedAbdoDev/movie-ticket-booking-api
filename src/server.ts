import "dotenv/config";
import express from "express";
import connectDB from "./config/db";
import { setupSwagger } from "./config/swagger";
import errorHandler from "./utils/errorHandler";

const app = express();

app.use(express.json());
connectDB();

import authRouter from "./modules/auth/auth.route";
import bookingRouter from "./modules/booking/booking.route";
import movieRouter from "./modules/movie/movie.route";
import showtimesRouter from "./modules/showtime/showtime.route";
import ratingsRouter from "./modules/ratings/rating.route";

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/movies", movieRouter);
app.use("/api/showtimes", showtimesRouter);
app.use("/api/ratings", ratingsRouter);

setupSwagger(app);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
