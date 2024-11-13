import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";
import { Car } from "../models/car.model.js";
import {
  uploadOnCloudinary,
  updateFileOnCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";

const addCarDetails = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description || (tags && tags.length === 0)) {
    throw new ApiError(
      400,
      "Title, description, and at least one tag are required."
    );
  }

  const isCarPresent = await Car.findOne({
    $or: [{ title }, { description }],
  });
  if (isCarPresent) {
    throw new ApiError(
      409,
      "A car with a similar title or description already exists."
    );
  }

  let carImagesLocalPath = [];
  if (req.files && Array.isArray(req.files.car) && req.files.car.length > 0) {
    carImagesLocalPath = req.files.car;
  } else {
    throw new ApiError(400, "At least one image is required.");
  }

  let carImages = [];
  for (let carImage of carImagesLocalPath) {
    if (!carImage.path) {
      throw new ApiError(400, "Image path cannot be empty.");
    }

    const uploadResult = await uploadOnCloudinary(carImage.path);
    if (!uploadResult.url) {
      throw new ApiError(500, "Error while uploading image.");
    }
    carImages.push(uploadResult.url);
  }

  if (carImages.length === 0) {
    throw new ApiError(500, "Error occurred while uploading images.");
  }

  const car = await Car.create({
    title,
    description,
    tags,
    images: carImages,
    userId: req.user?._id,
  });

  const addedCar = await Car.findById(car._id).select("-userId");

  return res
    .status(200)
    .json(new ApiResponse(200, addedCar, "Car added successfully"));
});
const getCarDetails = asyncHandler(async (req, res) => {
  const { carId } = req.params;
  console.log(carId);
  if (!carId) {
    throw new ApiError(400, "Car Id is required.");
  }
  const carDetails = await Car.findById(new mongoose.Types.ObjectId(carId));
  if (!carDetails) {
    throw new ApiError(409, "Car does not exists.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, carDetails, "Car Details Fetched successfully"));
});
const updateCarDetails = asyncHandler(async (req, res) => {
  const { title, description, tags, imagePublicIds, carId } = req.body;
  console.log(req.body);
  if (!title || !description || !tags || tags.length === 0) {
    throw new ApiError(
      400,
      "Title, description, and at least one tag are required."
    );
  }

  const isCarPresent = await Car.findById(carId);
  if (!isCarPresent) {
    throw new ApiError(404, "Car does not exist.");
  }

  let carImages = [];

  // Update images only if imagePublicIds are provided
  if (imagePublicIds && imagePublicIds.length > 0) {
    let carImagesLocalPath = [];
    if (req.files && Array.isArray(req.files.car) && req.files.car.length > 0) {
      carImagesLocalPath = req.files.car;
    } else {
      throw new ApiError(
        400,
        "At least one new image is required if updating images."
      );
    }

    // Check if the number of image files and public IDs match
    if (carImagesLocalPath.length !== imagePublicIds.length) {
      throw new ApiError(
        400,
        "The number of images and public IDs must match."
      );
    }

    // Loop through the images to replace them on Cloudinary
    for (let i = 0; i < carImagesLocalPath.length; i++) {
      const carImage = carImagesLocalPath[i];
      const publicId = imagePublicIds[i];

      if (!carImage.path) {
        throw new ApiError(400, "Image path cannot be empty.");
      }

      // Upload the new image, replacing the one with the specified public ID
      const uploadResult = await updateFileOnCloudinary(
        carImage.path,
        publicId
      );

      if (!uploadResult || !uploadResult.url) {
        throw new ApiError(500, "Error while uploading image.");
      }

      carImages.push(uploadResult.url);
    }
  } else {
    // Retain the existing images if no new images are provided
    carImages = isCarPresent.images;
  }

  // Update car details
  const updatedCarDetails = await Car.findByIdAndUpdate(
    carId,
    {
      $set: {
        title,
        description,
        tags,
        images: carImages,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCarDetails,
        "Car details updated successfully."
      )
    );
});

export { addCarDetails, getCarDetails, updateCarDetails };
