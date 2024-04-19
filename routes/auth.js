import express from "express";

import * as UserController from "../controllers/user.js";
import { mapUser } from "../utils/mapUser.js";

const authRouter = express.Router({ mergeParams: true });

authRouter.post("/register", async (req, res) => {
    try {
        const { token, user } = await UserController.register(
            req.body.email,
            req.body.password
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.send({
            error: null,
            user: mapUser(user),
        });
    } catch (error) {
        console.log("error :>> ", error);

        res.send({
            error:
                error.code === 11000 ? "Email already exists" : error.message,
            user: null,
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { token, user } = await UserController.login(
            req.body.email,
            req.body.password
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.send({
            error: null,
            user: mapUser(user),
        });
    } catch (error) {
        console.log("error :>> ", error);

        res.send({
            error: error.message,
            user: null,
        });
    }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", "");
    res.send({
        error: null,
        success: true,
    });
});

export default authRouter;
