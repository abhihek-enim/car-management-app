import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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

app.get("/api/docs", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/15847976/2sAY55by15");
});
export { app };
