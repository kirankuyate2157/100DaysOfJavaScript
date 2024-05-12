import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js';
import { uploadVideo } from '../controllers/stream.controller.js';

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/upload").post(upload.single("file"), uploadVideo);

export default router