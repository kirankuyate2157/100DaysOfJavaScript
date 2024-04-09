import express from "express";

import {
  generateUrl,
  getDownloadUrl,
  deleteFile
} from "../controllers/s3document.controller.js";

//addressing and mapping thought routers
const router = express.Router();

// Route for generating upload and download URLs
router.get("/generate-upload-url", generateUrl);
router.get("/generate-download-url", getDownloadUrl);
router.delete("/delete-file", deleteFile);

export default router;
