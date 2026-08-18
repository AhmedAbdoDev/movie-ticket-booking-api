import { Request, Response } from "express";
import { login, register } from "./auth.service";
import { type AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const registerController = async (req: Request, res: Response) => {
  const result = await register(req.body);

  res.status(201).json({ success: true, message: "Account created successfully", data: result });
};

export const loginController = async (req: Request, res: Response) => {
  const result = await login(req.body);

  res.status(200).json({ success: true, message: "Login successful", data: result });
};

export const meController = (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ success: true, data: { user: req.user } });
};
