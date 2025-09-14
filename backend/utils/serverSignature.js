import crypto from "crypto";

const serverSecret = process.env.SERVER_SECRET;

export function createVerificationHash(publicKey, privateKey) {
    const data = publicKey.trim() + privateKey.trim();
    return crypto.createHash("sha256").update(data).digest("hex");
}

export function createServerSignature(hash) {
    return crypto.createHmac("sha256", serverSecret).update(hash).digest("hex");
}