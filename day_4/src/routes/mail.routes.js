import express from "express";

import { emails } from "../controllers/mail.controller.js";

//addressing and mapping thought routers
const router = express.Router();

router.route("/").post(emails);

export default router;
