import { Request, Response } from "express";
import { sessions } from "../data/sessionStore";
import { getIO } from "../socket/io";

export const paySessionController = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!sessions[id]) {
    return res.status(404).json({ message: "Session not found" });
  }

  sessions[id].paid = true;

  const io = getIO();
  io.emit("paymentSuccess", { id });

  res.json({ message: "Payment simulated successfully" });
};
