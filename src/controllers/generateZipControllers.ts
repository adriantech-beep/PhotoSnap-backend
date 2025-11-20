// import { Request, Response, NextFunction } from "express";
// import fs from "fs";
// import path from "path";
// import JSZip from "jszip";
// import axios from "axios";

// export const generateZip = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { sessionId } = req.params;

//     if (!sessionId) {
//       return res.status(400).json({ message: "Session ID is required" });
//     }

//     const sessionFile = path.join(
//       __dirname,
//       "../sessions",
//       `${sessionId}.json`
//     );

//     if (!fs.existsSync(sessionFile)) {
//       return res.status(404).json({ message: "Session data not found" });
//     }

//     const sessionData = JSON.parse(fs.readFileSync(sessionFile, "utf-8"));
//     const urls: string[] = sessionData.urls;

//     if (!urls || urls.length === 0) {
//       return res.status(400).json({ message: "No images to zip." });
//     }

//     const zip = new JSZip();

//     // Download each Cloudinary image buffer
//     for (let i = 0; i < urls.length; i++) {
//       const imageUrl = urls[i];

//       const response = await axios.get(imageUrl, {
//         responseType: "arraybuffer",
//       });

//       zip.file(`image_${i + 1}.png`, response.data);
//     }

//     const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

//     const zipFolder = path.join(__dirname, "../sessions/zips");
//     if (!fs.existsSync(zipFolder)) fs.mkdirSync(zipFolder);

//     const zipPath = path.join(zipFolder, `${sessionId}.zip`);

//     fs.writeFileSync(zipPath, zipBuffer);

//     const downloadUrl = `/sessions/zips/${sessionId}.zip`;

//     return res.json({
//       message: "ZIP generated successfully",
//       zipUrl: downloadUrl,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// src/controllers/zipController.ts
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

    // Download images and add to zip
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
