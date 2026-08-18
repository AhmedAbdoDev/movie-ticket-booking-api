import { Router } from "express";
import { loginController, meController, registerController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";
import validate from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new customer or cinema admin
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Ahmed
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *               role:
 *                 type: string
 *                 enum: [CUSTOMER, CINEMA_ADMIN]
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       409:
 *         description: Email already in use
 *       422:
 *         description: Validation error
 */
router.post("/register", validate(registerSchema), registerController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and receive a JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginSchema), loginController);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the authenticated user's identity and role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user details
 *       401:
 *         description: Missing, invalid, or expired token
 */
router.get("/me", authenticate, meController);

export default router;
