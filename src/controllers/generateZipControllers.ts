import { Request, Response, NextFunction } from "express";
import JSZip from "jszip";
import axios from "axios";
import { readJSONFromGCS, uploadBufferToGCS } from "../upload/uploadToGCS";

export const generateZip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId)
      return res.status(400).json({ message: "Session ID is required" });

    const sessionPath = `sessions/${sessionId}.json`;
    const sessionData = await readJSONFromGCS(sessionPath);
    if (!sessionData || !sessionData.urls || !sessionData.urls.length) {
      return res
        .status(404)
        .json({ message: "Session data not found or empty" });
    }

    const zip = new JSZip();
    const urls: string[] = sessionData.urls;

    for (let i = 0; i < urls.length; i++) {
      const imageUrl = urls[i];
      const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
      zip.file(`image_${i + 1}.png`, resp.data);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const destPath = `zips/${sessionId}.zip`;

    const publicUrl = await uploadBufferToGCS(
      zipBuffer,
      destPath,
      "application/zip",
      true
    );

    return res.json({
      message: "ZIP generated successfully",
      zipUrl: publicUrl,
    });
  } catch (err) {
    next(err);
  }
};
