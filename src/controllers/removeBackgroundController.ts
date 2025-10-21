// controllers/removeBackgroundController.ts
import axios from "axios";
import FormData from "form-data";
import { Request, Response } from "express";

export const removeBackground = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Missing imageUrl" });
    }

    const formData = new FormData();
    formData.append("image_url", imageUrl);
    formData.append("size", "auto");

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": process.env.REMOVE_BG_API_KEY as string,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    res.json({
      image: `data:image/png;base64,${base64Image}`,
    });
  } catch (error: any) {
    console.error(
      "❌ Remove.bg failed:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to remove background", details: error.message });
  }
};
