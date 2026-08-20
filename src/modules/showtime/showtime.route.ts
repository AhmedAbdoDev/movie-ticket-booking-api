import { Router } from "express";
import validate from "../../middlewares/validate.middleware";
import {authenticate, authorize} from "../../middlewares/auth.middleware";    
import {createShowtimeSchema,getShowtimeByIdSchema,updateShowtimeSchema,deleteShowtimeSchema,getAllShowtimesSchema,} from "./showtime.validation";
import {createShowtimeController,getShowtimeByIdController,updateShowtimeController,deleteShowtimeController,getAllShowtimesController,getAvailableSeatsController} from "./showtime.controller";


const router = Router();



/**
 * @swagger
 * components:
 *   schemas:
 *     Showtime:
 *       type: object
 *       required:
 *         - movie
 *         - hallNumber
 *         - date
 *         - startTime
 *         - endTime
 *         - ticketPrice
 *         - totalCapacity
 *       properties:
 *         movie:
 *           type: string
 *           description: ID of the movie associated with the showtime
 *           example: "66c123abc456789012345678"
 *         hallNumber:
 *           type: integer
 *           description: Cinema hall number
 *           example: 2
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the showtime
 *           example: "2026-08-20T00:00:00.000Z"
 *         startTime:
 *           type: integer
 *           description: Showtime start time in minutes from the beginning of the day
 *           example: 1080
 *         endTime:
 *           type: integer
 *           description: Showtime end time in minutes from the beginning of the day
 *           example: 1200
 *         ticketPrice:
 *           type: number
 *           description: Ticket price
 *           example: 150
 *         totalCapacity:
 *           type: integer
 *           description: Total number of seats in the hall
 *           example: 100
 *       example:
 *         movie: "66c123abc456789012345678"
 *         hallNumber: 2
 *         date: "2026-08-20T00:00:00.000Z"
 *         startTime: 1080
 *         endTime: 1200
 *         ticketPrice: 150
 *         totalCapacity: 100
 */

/**
 * @swagger
 * tags:
 *   - name: Showtime
 *     description: Showtime management
 */


/**
 * @swagger
 * /api/showtimes:
 *   post:
 *     summary: Create a new showtime
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Showtime'
 *     responses:
 *       201:
 *         description: Showtime created successfully
 *       400:
 *         description: Invalid showtime data or start time is not before end time
 *       404:
 *         description: Movie not found
 *       409:
 *         description: Showtime conflict in the same hall and time
 */

router.post("/",authenticate,authorize("CINEMA_ADMIN"),validate(createShowtimeSchema), createShowtimeController);
/**
 * @swagger
 * /showtimes:
 *   get:
 *     tags:
 *        Showtime
 *     summary: Get all showtimes
 *     parameters:
 *        in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: false
 *         description: Page number
 *        in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         required: false
 *         description: Number of showtimes per page
 *     responses:
 *       200:
 *         description: Showtimes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/",authenticate,authorize("CINEMA_ADMIN"),validate(getAllShowtimesSchema), getAllShowtimesController);
/**
 * @swagger
 * /showtimes/{id}:
 *   get:
 *     tags:
 *        Showtime
 *     summary: Get a showtime by ID
 *     parameters:
 *         in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Showtime retrieved successfully
 *       404:
 *         description: Showtime not found
 */
router.get("/:id", authenticate,authorize("CINEMA_ADMIN"),validate(getShowtimeByIdSchema), getShowtimeByIdController);
/**
 * @swagger
 * /showtimes/{id}:
 *   put:
 *     tags:
 *       - Showtime
 *     summary: Update a showtime
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Showtime ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShowtime'
 *     responses:
 *       200:
 *         description: Showtime updated successfully
 *       400:
 *         description: Invalid showtime data or start time is not before end time
 *       404:
 *         description: Showtime not found
 *       409:
 *         description: Showtime conflict or total capacity is less than booked seats
 */
router.put("/:id",authenticate,authorize("CINEMA_ADMIN"), validate(updateShowtimeSchema), updateShowtimeController);
/**
 * @swagger
 * /showtimes/{id}:
 *   delete:
 *     tags:
 *       - Showtime
 *     summary: Delete a showtime
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Showtime deleted successfully
 *       404:
 *         description: Showtime not found
 *       409:
 *         description: Cannot delete a showtime with active bookings
 */
router.delete("/:id",authenticate,authorize("CINEMA_ADMIN"), validate(deleteShowtimeSchema), deleteShowtimeController);

router.get("/:id/seats",authenticate,authorize("CUSTOMER"),getAvailableSeatsController);

export default router;