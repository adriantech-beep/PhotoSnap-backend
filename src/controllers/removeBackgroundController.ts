import { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal";

export const removeBackgroundLocal = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "Missing imageUrl" });
    }

    // 1️⃣ Fetch image as buffer
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const inputBuffer = Buffer.from(response.data);

    // 2️⃣ Remove background (returns ArrayBuffer or Blob)
    console.log("🧠 Removing background using Imgly...");
    const result = await removeBackground(inputBuffer);

    // 3️⃣ Convert to Node.js Buffer safely
    let rawBuffer: Buffer;

    if (result instanceof Blob) {
      // Browser-style Blob → convert to ArrayBuffer → Buffer
      const arrayBuffer = await result.arrayBuffer();
      rawBuffer = Buffer.from(arrayBuffer);
      // @ts-ignore: Blob is available in Node 20+ environments
    } else if (result instanceof ArrayBuffer) {
      rawBuffer = Buffer.from(result);
    } else {
      throw new Error("Unexpected return type from removeBackground()");
    }

    // 4️⃣ Use sharp to clean & convert to PNG
    const outputBuffer = await sharp(rawBuffer).png().toBuffer();

    // 5️⃣ Send back as base64 image
    const base64 = outputBuffer.toString("base64");
    res.json({ cleanedImage: `data:image/png;base64,${base64}` });
  } catch (err: any) {
    console.error("❌ Background removal failed:", err);
    res.status(500).json({
      error: "Background removal failed",
      details: err.message || err.toString(),
    });
  }
};
