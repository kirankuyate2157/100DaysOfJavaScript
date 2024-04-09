import { Router } from 'express';
import {
    verifyPayment,makePayment
} from "../controllers/payment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
// router.use(verifyJWT); 

router.route("/make-payment").post(makePayment);
router.route("/verify-payment").post(verifyPayment);

export default router;