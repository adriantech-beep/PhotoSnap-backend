// import { v2 as cloudinary } from "cloudinary";
// import multer from "multer";
// import { Readable } from "stream";
// import dotenv from "dotenv";
// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// export const uploadToCloudinary = async (
//   fileBuffer: Buffer,
//   filename: string,
//   folder: string
// ) => {
//   // Convert buffer to base64 string
//   const base64 = fileBuffer.toString("base64");
//   // Use PNG as default; adjust if you have other types
//   const dataUri = `data:image/png;base64,${base64}`;

//   // Upload using Cloudinary uploader (returns Promise)
//   const result = await cloudinary.uploader.upload(dataUri, {
//     folder,
//     use_filename: true,
//     unique_filename: true,
//     overwrite: false,
//   });

//   return result; // contains secure_url
// };

// src/utils/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  filename?: string
) {
  const base64 = buffer.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });

  return result; // result.secure_url, public_id, etc.
}
