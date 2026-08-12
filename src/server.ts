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
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
