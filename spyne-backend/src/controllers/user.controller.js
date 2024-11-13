import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((field) => field?.trim() === ""))
    throw new ApiError(400, "All field are Required");

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User/Email already exists.");
  }

  // entry into database now

  const user = await User.create({
    email,
    password,
    username: username?.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password"); // removing password  from  recieved userdata to avoid disclose.

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password); // user instance will have access to middlewares added in user model.
  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }

  const { accessToken } = await generateAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");
  const options = {
    httpOnly: true,
    secure: true,
  }; // cookies not editable for client side.

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
const updateUserDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username and Email are required.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { username, email },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully. "));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  console.log(oldPassword, newPassword);

  if (!oldPassword && !newPassword) {
    throw new ApiError(400, "Old/New password are required");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: true }); // database is in other continent.
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  }; // cookies not editable for client side.

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logout."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateUserDetails,
  changeCurrentPassword,
  getCurrentUser,
};
