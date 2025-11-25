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

  return result;
}
