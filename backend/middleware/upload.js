const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dktaybbnl",
  api_key: "736991446541655",
  api_secret: "ThDKnJDGyyIO8zLWnqNCQSOqfBY",
});

// Create multer storage to handle file uploads
const storage = multer.diskStorage({});

// Multer middleware
const upload = multer({ storage });

// Function to upload to Cloudinary
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
};

module.exports = { upload, uploadToCloudinary };
