import express from "express";
import { Router } from "express";
import { generateZip } from "../controllers/generateZipControllers";

const router = express.Router();

router.get("/generate-zip/:sessionId", generateZip);

export default router;
