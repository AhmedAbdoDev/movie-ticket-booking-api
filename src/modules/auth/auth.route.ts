import { Router } from "express";
import { testAuthController } from "./auth.controller";
import { testAuthSchema } from "./auth.validation";
import validate from "../../middlewares/validate.middleware";

const router = Router();

/**
 * @swagger
 * /api/auth/test:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Test authentication module
 *     description: Test endpoint to verify the Auth module structure, validation, controller, and service.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed
 *     responses:
 *       200:
 *         description: Auth module is working successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Auth module is working
 *                 name:
 *                   type: string
 *                   example: Ahmed
 *       400:
 *         description: Validation error
 */
router.post("/test", validate(testAuthSchema), testAuthController);

export default router;
