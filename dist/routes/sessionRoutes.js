"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createSessionController_1 = require("../controllers/createSessionController");
const paySessionController_1 = require("../controllers/paySessionController");
const payStatusController_1 = require("../controllers/payStatusController");
const router = express_1.default.Router();
router.post("/create-session", createSessionController_1.createSession);
router.post("/pay/:id", paySessionController_1.paySessionController);
router.get("/session/:id", payStatusController_1.payStatusController);
exports.default = router;
