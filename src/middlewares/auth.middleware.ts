import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../error/AppError";
import User from "../models/user.model";

type UserRole = "CINEMA_ADMIN" | "CUSTOMER";
const USER_ROLES: UserRole[] = ["CINEMA_ADMIN", "CUSTOMER"];

type AuthenticatedUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

export const authenticate = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
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
      !payload.sub
    ) {
      return next(new AppError("Invalid authentication token", 401));
    }

    const user = await User.findById(payload.sub).select("-password").lean();
    if (!user) return next(new AppError("User associated with this token no longer exists", 401));
    if (!USER_ROLES.includes(user.role as UserRole)) {
      return next(new AppError("User has an invalid role", 401));
    }

    req.user = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
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
