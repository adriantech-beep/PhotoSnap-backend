import { Request, Response } from "express";

import { sessions } from "../data/sessionStore";

export const createSession = (req: Request, res: Response) => {
  const id = Date.now().toString();

  try {
    sessions[id] = { paid: false };
    const qrUrl = `${process.env.FRONTEND_URL}/#/pay/${id}`;

    res.json({ sessionId: id, qrUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create session" });
  }
};
