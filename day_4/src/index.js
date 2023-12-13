import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/mongoDB.js';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send("hey i back end api started now testing .... 🍻⏳")
})


app.listen(process.env.PORT, () => {
    connectDB()
    console.log("listening on port http://localhost:" + process.env.PORT + "  🏃🏻💨 🚀")
})