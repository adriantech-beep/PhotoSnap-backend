"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payStatusController = void 0;
const sessionStore_1 = require("../data/sessionStore");
const payStatusController = (req, res) => {
    const { sessionId } = req.params;
    const session = sessionStore_1.sessions[sessionId];
    if (!session) {
        return res
            .status(404)
            .json({ success: false, message: "Session not found" });
    }
    res.json(session);
};
exports.payStatusController = payStatusController;
