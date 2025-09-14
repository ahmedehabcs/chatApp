import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import { generateKeyPair } from "../utils/cryptoGenerator.js";
import { formatPublicKey, formatPrivateKey } from "../utils/formatKeys.js";
import { createVerificationHash, createServerSignature } from "../utils/serverSignature.js";
import { createKeysPdf } from "../utils/pdfGenerator.js";
import handleSendErrors from "../utils/handleSendErrors.js";
import generateJWT from "../utils/generateJWT.js";
import crypto from "crypto";

export const signup = async (req, res, next) => {
    try {
        const { publicKey, privateKey } = generateKeyPair();
        await User.create({ publicKey: publicKey.trim() });
        res.status(201).json({ message: "User created successfully", success: true, keys: { publicKey, privateKey } });
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
};

export const downloadKeys = async (req, res, next) => {
    try {
        const { publicKey, privateKey } = req.body;

        if (!publicKey || !privateKey) {
            return handleSendErrors("Both keys are required", false, 400, next);
        }

        // Format keys
        const formattedPublicKey = formatPublicKey(publicKey);
        const formattedPrivateKey = formatPrivateKey(privateKey);

        // Create hash & server signature
        const hash = createVerificationHash(formattedPublicKey, formattedPrivateKey);
        const signature = createServerSignature(hash);

        // Generate PDF
        const pdfBuffer = await createKeysPdf(formattedPublicKey, formattedPrivateKey, signature);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=mrhoba-keys.pdf");
        res.send(pdfBuffer);
    } catch (error) {
        console.log(error)
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
};




export const createChallenge = async (req, res, next) => {
    try {
        let { publicKey } = req.body;
        if (!publicKey) return handleSendErrors("Public key is required", false, 400, next);
        publicKey = publicKey.trim();

        const user = await User.findOne({ publicKey });
        if (!user) return handleSendErrors("User not found", false, 404, next);

        let challengeDoc = await Challenge.findOne({ publicKey });

        if (challengeDoc && challengeDoc.expiresAt > Date.now()) {
            return res.json({ success: true, challenge: challengeDoc.challenge });
        }

        if (challengeDoc) await Challenge.deleteOne({ _id: challengeDoc._id });

        const challenge = crypto.randomBytes(32).toString("hex");
        challengeDoc = await Challenge.create({
            publicKey,
            challenge,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        res.json({ success: true, challenge: challengeDoc.challenge });
    } catch (error) {
        console.log(error);
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
};

export const verifySignin = async (req, res, next) => {
    try {
        let { publicKey, signature } = req.body;
        if (!publicKey || !signature) return handleSendErrors("Public key and signature are required", false, 400, next);

        publicKey = publicKey.trim();
        const challengeDoc = await Challenge.findOne({ publicKey });
        if (!challengeDoc || challengeDoc.expiresAt < Date.now()) {
            return handleSendErrors("Challenge expired or not found", false, 401, next);
        }

        const verifier = crypto.createVerify("SHA256");
        verifier.update(challengeDoc.challenge);
        verifier.end();

        const isValid = verifier.verify(publicKey, Buffer.from(signature, "base64"));
        if (!isValid) return handleSendErrors("Invalid signature", false, 401, next);

        await Challenge.deleteOne({ _id: challengeDoc._id });

        const token = generateJWT(publicKey);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1h
        });

        res.json({ success: true, message: "Signin successful" });
    } catch (error) {
        console.log(error);
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
};

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