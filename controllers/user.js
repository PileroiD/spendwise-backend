import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import UserModel from "../models/User.js";

export const register = async (email, password) => {
    if (!password || !email) {
        throw new Error("Incorrect data entered");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
        email,
        password: passwordHash,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: "30d",
    });

    return { token, user };
};

export const login = async (email, password) => {
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new Error("Invalid login or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: "30d",
    });

    return { token, user };
};
