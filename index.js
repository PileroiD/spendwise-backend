import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import router from "./routes/index.js";

dotenv.config();

const port = 4444;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use("/", router);

mongoose
    .connect(process.env.DB_ACCESS)
    .then(() => {
        console.log("DB ok");
    })
    .catch((err) => {
        console.log("DB error: ", err);
    });

app.listen(port, (error) => {
    if (error) {
        return console.log(error);
    }

    console.log("Server ok");
});
