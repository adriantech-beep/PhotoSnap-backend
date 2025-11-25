import { Router } from "express";
import multer from "multer";
import { uploadMultipleImages } from "../controllers/uploadControllers";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/upload-images", upload.array("images", 20), uploadMultipleImages);

export default router;
