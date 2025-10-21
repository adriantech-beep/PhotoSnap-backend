import { Server as IOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import { sessions } from "../data/sessionStore";

let io: IOServer;

export const initSocket = (server: HTTPServer) => {
  io = new IOServer(server, {
    cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] },
  });

  // io.on("connection", (socket: Socket) => {
  //   console.log("Socket connected:", socket.id);

  //   socket.on("joinSession", (sessionId: string) => {
  //     socket.join(sessionId);
  //     console.log(`Socket ${socket.id} joined session ${sessionId}`);

  //     // If session already has a controlMode, notify immediately
  //     const session = sessions[sessionId];
  //     if (session?.controlMode) {
  //       socket.emit("controlModeSelected", {
  //         sessionId,
  //         controlMode: session.controlMode,
  //       });
  //     }
  //   });

  //   socket.on(
  //     "setControlMode",
  //     ({
  //       sessionId,
  //       controlMode,
  //     }: {
  //       sessionId: string;
  //       controlMode: string;
  //     }) => {
  //       // ✅ Ensure session exists
  //       if (!sessions[sessionId]) {
  //         sessions[sessionId] = {}; // create if missing
  //       }

  //       sessions[sessionId].controlMode = controlMode;

  //       // ✅ Emit only to that session room
  //       io.to(sessionId).emit("controlModeSelected", {
  //         sessionId,
  //         controlMode,
  //       });

  //       console.log(
  //         `Control mode for session ${sessionId} set to ${controlMode}`
  //       );
  //     }
  //   );

  //   socket.on("disconnect", () => {
  //     console.log("Socket disconnected:", socket.id);
  //   });
  // });

  // console.log("✅ Socket.io initialized");
  // return io;

  io.on("connection", (socket) => {
    console.log("🟢 Client connected");

    socket.on("joinSession", (sessionId) => {
      socket.join(sessionId);
      console.log(`👥 Joined session ${sessionId}`);
    });

    socket.on("setControlMode", ({ sessionId, controlMode }) => {
      sessions[sessionId] = controlMode;
      console.log(`🎮 ${controlMode} is now in control of ${sessionId}`);

      io.to(sessionId).emit("controlModeSelected", { controlMode });
    });

    // ✅ Allow devices to get the current control mode (for refresh recovery)
    socket.on("getControlMode", ({ sessionId }) => {
      if (sessions[sessionId]) {
        socket.emit("controlModeSelected", {
          controlMode: sessions[sessionId],
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected");
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized yet!");
  return io;
};
