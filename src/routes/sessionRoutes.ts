import express from "express";
import { createSession } from "../controllers/createSessionController";
import { paySessionController } from "../controllers/paySessionController";
import { payStatusController } from "../controllers/payStatusController";
import { setControlModeController } from "../controllers/setControlModeController";

const router = express.Router();

router.post("/create-session", createSession);
router.post("/pay/:id", paySessionController);
router.get("/session/:id", payStatusController);
router.post("/set-control-mode", setControlModeController);

export default router;
