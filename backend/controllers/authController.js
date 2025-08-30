import User from "../models/User.js";
import { generatePublicKey, generatePrivateKey } from "../utils/cryptoGenerator.js";
import handleSendErrors from "../utils/handleSendErrors.js";
import generateJWT from "../utils/generateJWT.js";

// POST /api/auth/signup
export const signup = async (req, res, next) => {
    try {
        const publicKey = generatePublicKey();
        const privateKey = generatePrivateKey();
        const user = await User.create({ publicKey, privateKey });
        res.status(201).json({message: "User created successfully", success: true, user: user.privateKey});
    } catch (error) {
        if (error.code === 11000){
            return handleSendErrors("This user is already registered before, please try again", false, 400, next);
        }
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}

// POST /api/auth/signin
export const signin = async (req, res, next) => {
    try {
        const { privateKey } = req.body;
        if (!privateKey) {
            return handleSendErrors("Private key is required", false, 400, next);
        }
        const user = await User.findOne({ privateKey });

        if(!user) {
            return handleSendErrors("Incorrect private key", false, 401, next);
        }
        const token = generateJWT(user.publicKey);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 
        })
        res.json({message: "Successful signin", success: true, user});
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}

// POST /api/auth/logout
export const logout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}