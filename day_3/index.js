import express from 'express';
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send("hii this kiran testing you ok !");
})

app.listen(3000, () => {
    console.log("listening on port 3000 ⌛ ")
})