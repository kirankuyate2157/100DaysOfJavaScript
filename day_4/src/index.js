import express from "express";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import {app} from './app.js'
import connectDB from "./db/mongoDB.js";


app.listen(process.env.PORT || 8080, () => {
  connectDB();
  console.log(
    "listening on port http://localhost:" + process.env.PORT + "  🏃🏻💨 🚀"
  );
});
