import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const checkAuth = async (req, res, next) => {
    try {
        const tokenData = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        const user = await UserModel.findById(tokenData.id);

        if (!user) {
            throw new Error("Access denied");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("error :>> ", error);
        res.status(400).send({
            error: "Access denied",
        });
    }
};
