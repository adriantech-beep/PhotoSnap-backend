import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: IOServer;

export const initSocket = (server: HTTPServer) => {
  io = new IOServer(server, {
    cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] },
  });
  console.log("✅ Socket.io initialized");
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized yet!");
  return io;
};
