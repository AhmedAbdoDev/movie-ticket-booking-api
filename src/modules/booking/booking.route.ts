import { Router } from "express";
import validate from "../../middlewares/validate.middleware";

import {
  createBookingSchema,
  getBookingByIdSchema,
  cancelBookingSchema,
  getBookingsSchema,
  getAllBookingsSchema,
} from "./booking.validation";

import {
  getBookingsController,
  createBookingController,
  getAllBookingsController,
  getBookingByIdController,
  cancelBookingController,
} from "./booking.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Movie ticket booking endpoints
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get customer's bookings
 *     description: Returns all bookings belonging to the authenticated customer.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validate(getBookingsSchema),
  getBookingsController,
);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Creates a booking for the authenticated customer.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - selectedSeats
 *             properties:
 *               showtimeId:
 *                 type: string
 *                 example: "66c8a1b2c3d4e5f678901234"
 *               selectedSeats:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                 example: ["A1", "A2", "A3"]
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid booking data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Showtime not found
 *       409:
 *         description: One or more selected seats are already booked
 */
router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validate(createBookingSchema),
  createBookingController,
);

/**
 * @swagger
 * /api/bookings/all:
 *   get:
 *     summary: Get all bookings
 *     description: Returns all bookings in the system. Intended for cinema administrators.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/all",
  authenticate,
  authorize("CINEMA_ADMIN"),
  validate(getAllBookingsSchema),
  getAllBookingsController,
);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     description: Returns a specific booking by its ID.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "66c8a1b2c3d4e5f678901234"
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       400:
 *         description: Invalid booking ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.get(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  validate(getBookingByIdSchema),
  getBookingByIdController,
);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     description: Cancels a booking before the movie starts.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "66c8a1b2c3d4e5f678901234"
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Invalid booking ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not allowed to cancel this booking
 *       404:
 *         description: Booking not found
 *       409:
 *         description: Booking cannot be cancelled
 */
router.patch(
  "/:id/cancel",
  authenticate,
  authorize("CUSTOMER"),
  validate(cancelBookingSchema),
  cancelBookingController,
);

export default router;
