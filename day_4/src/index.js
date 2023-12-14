import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/mongoDB.js';
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }))  //json upload limit to save server from crash..
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  //url data understanding 
app.use(express.static("public")) //store file direct on server for public access
app.use(cookieParser())  //cookie  set get operations






app.get('/', (req, res) => {
    res.send("hey i back end api started now testing .... 🍻⏳")
})


app.listen(process.env.PORT || 8000, () => {
    connectDB()
    console.log("listening on port http://localhost:" + process.env.PORT + "  🏃🏻💨 🚀")
})