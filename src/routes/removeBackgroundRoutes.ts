import express from "express";
import { removeBackgroundLocal } from "../controllers/removeBackgroundController";

const router = express.Router();

router.post("/remove-background", removeBackgroundLocal);

export default router;
