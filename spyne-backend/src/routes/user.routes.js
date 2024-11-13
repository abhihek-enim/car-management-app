import { Router } from "express";
import { upload } from "../middlewares/multer.middlerware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserDetails,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

// secure routes: checking if user has accessToken or not.
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateUserDetails); // working

export default router;
