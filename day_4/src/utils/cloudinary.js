import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv"; // Import dotenv for loading environment variables
import fs from "fs";

// Load environment variables from .env file
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to cloudinary storage
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File upload successful
    // console.log("File upload successful 🌨️..", response.url);
    fs.unlinkSync(localFilePath); // Remove the local file temporary file that failed to upload
    // console.log("local File removed successful 🪠🧹😰..", localFilePath);
    return response;
  } catch (error) {
    console.log("Upload failed.. ", error);
    fs.unlinkSync(localFilePath); // Remove the local file temporary file that failed to upload
    return null;
  }
};

export { uploadOnCloudinary };
