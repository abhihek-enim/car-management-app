import { Router } from "express";
import { upload } from "../middlewares/multer.middlerware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addCarDetails,
  deleteCar,
  getAllCars,
  getCarDetails,
  getCarsbyUserId,
  updateCarDetails,
} from "../controllers/car.controller.js";

const router = Router();

router
  .route("/addCar")
  .post(
    verifyJWT,
    upload.fields([{ name: "car", maxCount: 10 }]),
    addCarDetails
  );

router.route("/car/:carId").get(verifyJWT, getCarDetails);
router
  .route("/updateCar")
  .post(
    verifyJWT,
    upload.fields([{ name: "car", maxCount: 10 }]),
    updateCarDetails
  );

router.route("/deleteCar/:carId").delete(verifyJWT, deleteCar);

router.route("/getAllCars").get(verifyJWT, getAllCars);
router.route("/getCarsByUserId").get(verifyJWT, getCarsbyUserId);

export default router;
