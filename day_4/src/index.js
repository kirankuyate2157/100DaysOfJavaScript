import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
dotenv.config({
  path: "./.env",
});
import connectDB from "./db/mongoDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";

//routers
import UserRouter from "./routes/user.route.js";

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
app.use("/api/v1/users", UserRouter);

app.get("/", (req, res) => {
  res.send("hey i back end api started now testing .... 🍻⏳");
});

app.listen(process.env.PORT || 8000, () => {
  connectDB();
  console.log(
    "listening on port http://localhost:" + process.env.PORT + "  🏃🏻💨 🚀"
  );
});
