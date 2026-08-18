import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import User from "../../models/user.model";
import AppError from "../../error/AppError";

type UserRole = "CINEMA_ADMIN" | "CUSTOMER";

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
};

type LoginInput = {
  email: string;
  password: string;
};

const createToken = (userId: string, role: UserRole) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError("JWT_SECRET is not configured", 500);

  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as NonNullable<
    SignOptions["expiresIn"]
  >;
  return jwt.sign({ role }, secret, {
    subject: userId,
    expiresIn,
  });
};

const userResponse = (user: { _id: { toString(): string }; fullName: string; email: string; role: UserRole }) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  role: user.role,
});

export const register = async (input: RegisterInput) => {
  const existingUser = await User.exists({ email: input.email });
  if (existingUser) throw new AppError("An account with this email already exists", 409);

  const password = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    fullName: input.fullName,
    email: input.email,
    password,
    role: input.role || "CUSTOMER",
  });

  return { user: userResponse(user), token: createToken(user._id.toString(), user.role) };
};

export const login = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email });
  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  return { user: userResponse(user), token: createToken(user._id.toString(), user.role) };
};
