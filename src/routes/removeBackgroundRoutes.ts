import express from "express";
import { removeBackground } from "../controllers/removeBackgroundController";

const router = express.Router();

router.post("/remove-background", removeBackground);

export default router;
