import { Request, Response } from "express";
import { sessions } from "../data/sessionStore";
import { getIO } from "../socket/io";

export const setControlModeController = (req: Request, res: Response) => {
  const { sessionId, controlMode } = req.body;

  if (!sessions[sessionId]) {
    return res.status(404).json({ message: "Session not found" });
  }

  sessions[sessionId].controlMode = controlMode;

  const io = getIO();
  io.emit("controlModeSelected", { sessionId, controlMode });

  res.json({ success: true });
};
