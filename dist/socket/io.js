"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] },
    });
    console.log("✅ Socket.io initialized");
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error("Socket.io not initialized yet!");
    return io;
};
exports.getIO = getIO;
