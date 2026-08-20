import { Router } from "express";
import validate from "../../middlewares/validate.middleware";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

import {
  createMovieSchema,
  updateMovieSchema,
  movieIdParamsSchema,
  getMoviesSchema,
} from "./movie.validation";

import {
  createMovieController,
  getMoviesController,
  getMovieByIdController,
  updateMovieController,
  deleteMovieController,
} from "./movie.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management endpoints
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies with Search & Filter
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by title
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [NOW_SHOWING, COMING_SOON]
 *         description: Filter by status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Filter by date (YYYY-MM-DD)
 *       - in: query
 *         name: showtime
 *         schema:
 *           type: string
 *         description: Filter by start time (HH:MM)
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 */
router.get("/", validate(getMoviesSchema), getMoviesController);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie retrieved successfully
 *       404:
 *         description: Movie not found
 */
router.get("/:id", validate(movieIdParamsSchema), getMovieByIdController);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie (Cinema Admin Only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - genre
 *               - duration
 *               - description
 *               - posterUrl
 *               - rating
 *               - status
 *             properties:
 *               title: { type: string, example: "Inception" }
 *               genre: { type: string, example: "Sci-Fi" }
 *               duration: { type: number, example: 148 }
 *               description: { type: string, example: "A thief who steals corporate secrets..." }
 *               posterUrl: { type: string, example: "https://example.com/inception.jpg" }
 *               rating: { type: number, example: 8.8 }
 *               status: { type: string, enum: [NOW_SHOWING, COMING_SOON], example: "NOW_SHOWING" }
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Cinema Admin only
 */
router.post(
  "/",
  authenticate,
  authorize("CINEMA_ADMIN"),
  validate(createMovieSchema),
  createMovieController,
);

/**
 * @swagger
 * /api/movies/{id}:
 *   patch:
 *     summary: Update a movie (Cinema Admin Only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Inception (Updated)" }
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Cinema Admin only
 */
router.patch(
  "/:id",
  authenticate,
  authorize("CINEMA_ADMIN"),
  validate(updateMovieSchema),
  updateMovieController,
);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie (Cinema Admin Only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Cinema Admin only
 */
router.delete(
  "/:id",
  authenticate,
  authorize("CINEMA_ADMIN"),
  validate(movieIdParamsSchema),
  deleteMovieController,
);

export default router;
