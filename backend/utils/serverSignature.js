import crypto from "crypto";

const serverSecret = process.env.SERVER_SECRET;

export function createServerSignature(hash) {
    return crypto.createHmac("sha256", serverSecret).update(hash).digest("hex");
}