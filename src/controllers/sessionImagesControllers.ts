import { Request, Response } from "express";
import { readJSONFromGCS } from "../upload/uploadToGCS";

export const getSessionImages = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

  const sessionPath = `sessions/${sessionId}.json`;
  const data = await readJSONFromGCS(sessionPath);
  if (!data) return res.status(404).json({ error: "Session not found" });

  return res.json({ urls: data.urls });
};
