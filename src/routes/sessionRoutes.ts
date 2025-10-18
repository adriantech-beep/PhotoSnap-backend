import express from "express";
import { createSession } from "../controllers/createSessionController";
import { paySessionController } from "../controllers/paySessionController";
import { payStatusController } from "../controllers/payStatusController";

const router = express.Router();

router.post("/create-session", createSession);
router.post("/pay/:id", paySessionController);
router.get("/session/:id", payStatusController);

export default router;
