import { signMessage, verifySignature } from "./messageFlow.js";

export async function validatePrivateKey(publicKey, privateKeyPem) {
    try {
        const testMessage = "validate_key_test";
        const signature = await signMessage(privateKeyPem, testMessage);
        const isValid = await verifySignature(publicKey, testMessage, signature);
        return isValid;
    } catch (err) {
        console.error("Private key validation failed:", err);
        return false;
    }
}