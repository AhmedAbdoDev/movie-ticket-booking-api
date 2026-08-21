import { Router } from "express";
import validate from "../../middlewares/validate.middleware";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

import {
  createRatingSchema,
  getMyRatingsSchema,
  movieRatingsParamsSchema,
  ratingIdParamsSchema,
} from "./rating.validation";

import {
  createRatingController,
  getMyRatingsController,
  getMovieRatingsController,
  deleteRatingController,
} from "./rating.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Movie ratings and reviews
 */

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     summary: Create a rating/review for a movie
 *     description: Allows a customer to rate and review a movie.
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie
 *               - rating
 *             properties:
 *               movie:
 *                 type: string
 *                 description: Movie ID
 *                 example: "65f123456789abcdef123456"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               review:
 *                 type: string
 *                 example: "Great movie, highly recommended!"
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Customer only
 *       404:
 *         description: Movie not found
 *       409:
 *         description: Customer has already rated this movie
 */
router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validate(createRatingSchema),
  createRatingController,
);

/**
 * @swagger
 * /api/ratings/my:
 *   get:
 *     summary: Get my ratings and reviews
 *     description: Returns all ratings and reviews created by the authenticated customer.
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ratings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Customer only
 */
router.get(
  "/my",
  authenticate,
  authorize("CUSTOMER"),
  validate(getMyRatingsSchema),
  getMyRatingsController,
);

/**
 * @swagger
 * /api/ratings/movie/{movieId}:
 *   get:
 *     summary: Get ratings and reviews for a movie
 *     tags: [Ratings]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 1
 *     responses:
 *       200:
 *         description: Movie ratings retrieved successfully
 *       404:
 *         description: Movie not found
 */
router.get(
  "/movie/:movieId",
  validate(movieRatingsParamsSchema),
  getMovieRatingsController,
);

/**
 * @swagger
 * /api/ratings/{id}:
 *   delete:
 *     summary: Delete a rating/review
 *     description: Customers can delete their own rating/review. Cinema admins can delete any rating/review.
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *         example: "65f123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rating not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("CUSTOMER", "CINEMA_ADMIN"),
  validate(ratingIdParamsSchema),
  deleteRatingController,
);

export default router;
