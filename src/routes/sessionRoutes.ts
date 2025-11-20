import { Router } from "express";
import { getSessionImages } from "../controllers/sessionImagesControllers";
import { generateZip } from "../controllers/generateZipControllers";
import { finalizeSession } from "../controllers/finalizeControllers";

const router = Router();

router.get("/sessions/:sessionId/images", getSessionImages);
router.get("/generate-zip/:sessionId", generateZip);
router.post("/finalize-session", finalizeSession);

export default router;
