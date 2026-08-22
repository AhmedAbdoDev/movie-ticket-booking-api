import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "../models/user.model";
import Movie from "../models/movie.model";
import Showtime from "../models/showtime.model";
import Booking from "../models/booking.model";

import { timeToMinutes } from "../utils/time";

dotenv.config();

const seed = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined");
    }

    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to MongoDB");

    // =========================
    // Clear existing data
    // =========================

    await Booking.deleteMany({});
    await Showtime.deleteMany({});
    await Movie.deleteMany({});
    await User.deleteMany({});

    console.log("Old data cleared");

    // =========================
    // Users
    // =========================

    const customerPassword = await bcrypt.hash("Password123", 10);

    const adminPassword = await bcrypt.hash("Admin123", 10);

    const users = await User.insertMany([
      {
        fullName: "Ahmed Customer",
        email: "customer@test.com",
        password: customerPassword,
        role: "CUSTOMER",
      },
      {
        fullName: "Cinema Admin",
        email: "admin@test.com",
        password: adminPassword,
        role: "CINEMA_ADMIN",
      },
    ]);

    const customer = users.find((user) => user.role === "CUSTOMER");

    const admin = users.find((user) => user.role === "CINEMA_ADMIN");

    if (!customer || !admin) {
      throw new Error("Failed to create seed users");
    }

    // =========================
    // Movies
    // =========================

    const movies = await Movie.insertMany([
      {
        title: "Interstellar",
        genre: "Sci-Fi",
        duration: 169,
        description:
          "A team of explorers travels through a wormhole in space in search of a new home for humanity.",
        posterUrl: "https://example.com/interstellar.jpg",
        status: "NOW_SHOWING",
      },
      {
        title: "Inception",
        genre: "Sci-Fi",
        duration: 148,
        description:
          "A skilled thief who steals secrets through dream-sharing technology is given a chance to erase his past.",
        posterUrl: "https://example.com/inception.jpg",
        status: "NOW_SHOWING",
      },
    ]);

    const interstellar = movies[0];
    const inception = movies[1];

    // =========================
    // Showtimes
    // =========================

    const now = new Date();

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const showtimes = await Showtime.insertMany([
      {
        movie: interstellar?._id,
        hallNumber: 1,
        date: tomorrow,
        startTime: timeToMinutes("18:00"),
        endTime: timeToMinutes("21:00"),
        ticketPrice: 150,
        totalCapacity: 50,
      },
      {
        movie: interstellar?._id,
        hallNumber: 2,
        date: tomorrow,
        startTime: timeToMinutes("21:30"),
        endTime: timeToMinutes("00:20"),
        ticketPrice: 180,
        totalCapacity: 40,
      },
      {
        movie: inception?._id,
        hallNumber: 1,
        date: dayAfterTomorrow,
        startTime: timeToMinutes("19:00"),
        endTime: timeToMinutes("21:30"),
        ticketPrice: 150,
        totalCapacity: 50,
      },
    ]);

    const firstShowtime = showtimes[0];
    const secondShowtime = showtimes[1];
    const thirdShowtime = showtimes[2];

    // =========================
    // Bookings
    // =========================

    const bookings = await Booking.insertMany([
      {
        customer: customer._id,
        showtime: firstShowtime?._id,
        selectedSeats: ["A1", "A2"],
        totalPrice: firstShowtime?.ticketPrice! * 2,
        bookingStatus: "CONFIRMED",
      },
      {
        customer: customer._id,
        showtime: firstShowtime?._id,
        selectedSeats: ["B1", "B2", "B3"],
        totalPrice: firstShowtime?.ticketPrice! * 3,
        bookingStatus: "CONFIRMED",
      },
      {
        customer: customer._id,
        showtime: secondShowtime?._id,
        selectedSeats: ["C1", "C2"],
        totalPrice: secondShowtime?.ticketPrice! * 2,
        bookingStatus: "PENDING",
      },
      {
        customer: customer._id,
        showtime: firstShowtime?._id,
        selectedSeats: ["D1", "D2"],
        totalPrice: firstShowtime?.ticketPrice! * 2,
        bookingStatus: "CANCELLED",
      },
      {
        customer: customer._id,
        showtime: thirdShowtime?._id,
        selectedSeats: ["E1", "E2", "E3"],
        totalPrice: thirdShowtime?.ticketPrice! * 3,
        bookingStatus: "CONFIRMED",
      },
    ]);

    // =========================
    // Output
    // =========================

    console.log("\n========== SEED COMPLETED ==========\n");

    // =========================
    // Customer
    // =========================

    console.log("CUSTOMER:");

    console.log({
      id: customer._id,
      email: customer.email,
      password: "Password123",
      role: customer.role,
    });

    // =========================
    // Admin
    // =========================

    console.log("\nADMIN:");

    console.log({
      id: admin._id,
      email: admin.email,
      password: "Admin123",
      role: admin.role,
    });

    // =========================
    // Movies
    // =========================

    console.log("\nMOVIES:");

    movies.forEach((movie) => {
      console.log({
        id: movie._id,
        title: movie.title,
        status: movie.status,
      });
    });

    // =========================
    // Showtimes
    // =========================

    console.log("\nSHOWTIMES:");

    showtimes.forEach((showtime) => {
      console.log({
        id: showtime._id,
        movie: showtime.movie,
        hallNumber: showtime.hallNumber,
        date: showtime.date,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        ticketPrice: showtime.ticketPrice,
        totalCapacity: showtime.totalCapacity,
      });
    });

    // =========================
    // Bookings
    // =========================

    console.log("\nBOOKINGS:");

    bookings.forEach((booking) => {
      console.log({
        id: booking._id,
        customer: booking.customer,
        showtime: booking.showtime,
        selectedSeats: booking.selectedSeats,
        totalPrice: booking.totalPrice,
        bookingStatus: booking.bookingStatus,
      });
    });

    console.log("\n====================================\n");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
