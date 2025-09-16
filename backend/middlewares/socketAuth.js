import jwt from "jsonwebtoken";
import cookie from "cookie";
import User from "../models/User.js";

export default async function socketAuth(socket, next) {
    try {
        const cookies = cookie.parse(socket.request.headers.cookie || "");
        const token = cookies["token"];

        if (!token) return next(new Error("No token provided"));

        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey, { issuer: "mrhoba9" });

        const user = await User.findOne({ publicKey: decoded.publicKey });
        if (!user) return next(new Error("User not found"));

        socket.userPublicKey = decoded.publicKey;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(new Error("Invalid or expired token"));
        }
        next(new Error("Internal server error"));
    }
}