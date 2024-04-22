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

const allowedOrigins = [process.env.ALLOWED_SITE];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use("/api", router);

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
