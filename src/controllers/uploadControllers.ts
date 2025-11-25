import { Request, Response, NextFunction } from "express";
import {
  uploadJSONToGCS,
  readJSONFromGCS,
  getPublicUrl,
} from "../upload/uploadToGCS";
import path from "path";
import { uploadBufferToCloudinary } from "../upload/uploadToCloudinary";

export const uploadMultipleImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const { folderName } = req.body;
    if (!folderName)
      return res.status(400).json({ message: "folderName required" });

    const folder = `photobooth/${folderName}`;

    const uploadPromises = (req.files as Express.Multer.File[]).map((file) =>
      uploadBufferToCloudinary(file.buffer, folder)
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map((r: any) => r.secure_url);

    const sessionPath = `sessions/${folderName}.json`;
    const existing = (await readJSONFromGCS(sessionPath)) || {
      sessionId: folderName,
      urls: [],
    };

    const combinedUrls = [...existing.urls, ...urls];

    await uploadJSONToGCS(
      { sessionId: folderName, urls: combinedUrls },
      sessionPath,
      true
    );

    const sessionPublicUrl = getPublicUrl(sessionPath);

    return res.json({
      sessionId: folderName,
      urls: combinedUrls,
      sessionPublicUrl,
    });
  } catch (err) {
    next(err);
  }
};
