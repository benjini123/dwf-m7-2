import { v2 as cloudinary } from "cloudinary";
import exp = require("constants");
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// export async function uploadToCloudinary(photo) {
//   cloudinary.uploader
//     .upload(photo, {
//       resource_type: "image",
//       discard_original_filename: true,
//       width: 1000,
//     })
//     .then(() => {
//       console.log("all good!");
//     })
//     .catch((err) => {
//       throw err.message;
//     });
// }
