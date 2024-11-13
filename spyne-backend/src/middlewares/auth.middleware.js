import { User } from "../models/user.model.js";
import { ApiError } from "../utils/APIError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get access token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If token is missing, throw unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the token using secret key
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user by ID in the decoded token, excluding password
    const user = await User.findById(decodedToken?._id).select("-password");

    // If user is not found, throw invalid token error
    if (!user) {
      throw new ApiError(401, "Invalid Access Token.");
    }

    // Attach user to request and proceed to the next middleware
    req.user = user;
    next();
  } catch (error) {
    // Handle token verification errors
    throw new ApiError(
      401,
      error?.message || "Error occurred while verifying token."
    );
  }
});
