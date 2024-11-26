import express from "express";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from './routes/project.route.js'
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

mongoose
  .connect(
    process.env.MONGO
  )
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log("Database Connection Error", e.message);
  });

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use('/api/project', projectRoutes )
