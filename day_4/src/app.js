import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

// ------- google pass start ------------
app.use(passport.initialize());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.session());
// ------- google pass end ------------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //json upload limit to save server from crash..
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url data understanding
app.use(express.static("public")); //store file direct on server for public access
app.use(cookieParser()); //cookie  set get operations

//routes
//routes import
import userRouter from "./routes/user.routes.js";
import healthCheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import s3Router from "./routes/s3.routes.js";
import locationRouter from "./routes/location.routes.js";
import streamRouter from "./routes/stream.routes.js"
//routes declaration
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/s3", s3Router);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/stream", streamRouter)
app.get("/", (req, res) => {
  res.send("hey i back end api started now testing .... 🍻⏳");
});

export { app };
