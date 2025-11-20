import { getSessionImages } from "../controllers/sessionImagesControllers";
import express from "express";

const router = express.Router();

router.get("/:sessionId", getSessionImages);

export default router;
