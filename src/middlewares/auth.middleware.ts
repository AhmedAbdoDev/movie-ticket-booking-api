import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../error/AppError";

type UserRole = "CINEMA_ADMIN" | "CUSTOMER";
const USER_ROLES: UserRole[] = ["CINEMA_ADMIN", "CUSTOMER"];

export type AuthenticatedRequest = Request & {
  user?: { id: string; role: UserRole };
};

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Authentication token is required", 401));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) return next(new AppError("JWT_SECRET is not configured", 500));

  try {
    const token = authorization.slice(7);
    const payload = jwt.verify(token, secret);
    if (
      typeof payload === "string" ||
      !payload.sub ||
      !payload.role ||
      !USER_ROLES.includes(payload.role as UserRole)
    ) {
      return next(new AppError("Invalid authentication token", 401));
    }

    req.user = { id: payload.sub, role: payload.role as UserRole };
    next();
  } catch {
    next(new AppError("Invalid or expired authentication token", 401));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Authentication is required", 401));
    if (!roles.includes(req.user.role)) return next(new AppError("You are not authorized to access this resource", 403));
    next();
  };
};

export const cinemaAdminOnly = authorize("CINEMA_ADMIN");
