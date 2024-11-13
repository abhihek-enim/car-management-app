import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" })); // declaring that you will be getting json upto limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // urlencoded for accepting different types of params
app.use(express.static("public"));
app.use(cookieParser());

//routes

//users routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

// cars routes
import carRouter from "./routes/car.routes.js";
app.use("/api/v1/cars", carRouter);
export { app };
