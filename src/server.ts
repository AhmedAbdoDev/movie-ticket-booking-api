import "dotenv/config";
import express, { Application } from "express";
import connectDB from "./config/db";
import { setupSwagger } from "./config/swagger";

const app = express();

app.use(express.json());
connectDB();
import authRouter from "./modules/auth/auth.route";

app.use("/api/auth", authRouter);

setupSwagger(app);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

export default app;
