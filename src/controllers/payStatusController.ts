import { Request, Response } from "express";
import { sessions } from "../data/sessionStore";

export const payStatusController = (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = sessions[sessionId];

  if (!session) {
    return res
      .status(404)
      .json({ success: false, message: "Session not found" });
  }

  res.json(session);
};
