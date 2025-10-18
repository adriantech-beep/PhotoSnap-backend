"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paySessionController = void 0;
const sessionStore_1 = require("../data/sessionStore");
const io_1 = require("../socket/io");
const paySessionController = (req, res) => {
    const { id } = req.params;
    if (!sessionStore_1.sessions[id]) {
        return res.status(404).json({ message: "Session not found" });
    }
    sessionStore_1.sessions[id].paid = true;
    const io = (0, io_1.getIO)();
    io.emit("paymentSuccess", { id });
    res.json({ message: "Payment simulated successfully" });
};
exports.paySessionController = paySessionController;
