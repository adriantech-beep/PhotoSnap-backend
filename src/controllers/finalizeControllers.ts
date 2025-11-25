import { Request, Response, NextFunction } from "express";
import QRCode from "qrcode";
import {
  readJSONFromGCS,
  uploadBufferToGCS,
  getPublicUrl,
} from "../upload/uploadToGCS";
import axios from "axios";
import JSZip from "jszip";

export const finalizeSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    const sessionPath = `sessions/${sessionId}.json`;
    const sessionData = await readJSONFromGCS(sessionPath);
    if (!sessionData || !sessionData.urls || sessionData.urls.length === 0) {
      return res.status(404).json({ error: "No session images found" });
    }

    const zip = new JSZip();
    const urls: string[] = sessionData.urls;
    for (let i = 0; i < urls.length; i++) {
      const resp = await axios.get(urls[i], { responseType: "arraybuffer" });
      zip.file(`photo-${i + 1}.png`, resp.data);
    }
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    const destPath = `zips/${sessionId}.zip`;
    const zipUrl = await uploadBufferToGCS(
      zipBuffer,
      destPath,
      "application/zip",
      true
    );

    const qrCode = await QRCode.toDataURL(zipUrl, {
      margin: 2,
      scale: 20,
      width: 1000,
      errorCorrectionLevel: "H",
    });

    const folderUrl = `https://cloudinary.com/console/media_library/folders/photobooth/${sessionId}`;

    return res.json({ sessionId, zipUrl, qrCode, folderUrl });
  } catch (err) {
    next(err);
  }
};
