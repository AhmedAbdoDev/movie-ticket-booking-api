import { Request, Response } from "express";
import { testAuth } from "./auth.service";

export const testAuthController = async (req: Request, res: Response) => {
  const result = await testAuth(req.body.name);

  res.status(200).json(result);
};
