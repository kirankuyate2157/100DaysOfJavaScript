import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import {
  registration,
  loginUser,
  logoutUser,
  refreshTokenToAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  loginGoogleDB,
  googleAuthFail,
} from "../controllers/user.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import "../middlewares/googleAuth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registration
);
router.route("/login").post(loginUser);
//googlesSign
router.route("/googlesign").get(
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  }),
  loginGoogleDB
);

router.route("/current-user").get(
  passport.authenticate("google", {
    successRedirect: `${process.env.BASE_URL}/api/v1/users/success`,
    failureRedirect: `${process.env.BASE_URL}/api/v1/users/fail`,
  })
);
router.route("/success").get(loginGoogleDB);
router.route("/fail").get(googleAuthFail);
//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshTokenToAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;
