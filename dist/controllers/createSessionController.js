"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = void 0;
const sessionStore_1 = require("../data/sessionStore");
const createSession = (req, res) => {
    const id = Date.now().toString();
    try {
        sessionStore_1.sessions[id] = { paid: false };
        const qrUrl = `${process.env.FRONTEND_URL}/#/pay/${id}`;
        res.json({ sessionId: id, qrUrl });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create session" });
    }
};
exports.createSession = createSession;
