import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB().then(() => {
  app.on("error", (error) => {
    console.log(error);
    throw error;
  });

  app.listen(process.env.PORT || 8000, () => {
    console.log(`App is listeining on port ${process.env.PORT}`);
  });
});
