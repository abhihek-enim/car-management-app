import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: "dwxfnfvwa",
  api_key: "666777466886145",
  api_secret: "pqGOlSHuHD_Uoa8lbNOog2U2n_g",
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //upload the file on cloudinary
    console.log(localFilePath);
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log(response);

    // fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteImagesFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    );

    const results = await Promise.all(deletePromises);

    return results;
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    throw new Error("Failed to delete images.");
  }
};

const updateFileOnCloudinary = async (localFilePath, publicId) => {
  try {
    if (!localFilePath || !publicId) return null;

    // Upload the new file to Cloudinary, overwriting the old one
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: publicId, // Set the public_id to the existing one to overwrite
      overwrite: true, // Make sure it overwrites the existing file
    });

    // Remove the locally saved temporary file after upload
    fs.unlinkSync(localFilePath);

    return response; // Return the updated response
  } catch (error) {
    console.log("Error while updating file on Cloudinary:", error);

    // If upload fails, remove the locally saved file
    fs.unlinkSync(localFilePath);

    return null; // Return null to indicate failure
  }
};

export {
  uploadOnCloudinary,
  updateFileOnCloudinary,
  deleteImagesFromCloudinary,
};
