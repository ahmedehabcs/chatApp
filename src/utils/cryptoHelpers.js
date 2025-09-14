import { formatPublicKey, formatPrivateKey } from "./formatKeys.js";

function pemToArrayBuffer(pem, label) {
    const base64 = pem
        .replace(`-----BEGIN ${label} KEY-----`, "")
        .replace(`-----END ${label} KEY-----`, "")
        .replace(/\s+/g, "");
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    return binary.buffer;
}

// Encrypt with recipient's public key
export async function encryptMessage(publicKeyPem, plaintext) {
    const formatted = formatPublicKey(publicKeyPem);
    const keyBuffer = pemToArrayBuffer(formatted, "PUBLIC");

    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        keyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
    );

    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encoded
    );
    return btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
}

// Decrypt with recipient's private key
export async function decryptMessage(privateKeyPem, ciphertextB64) {
    const formatted = formatPrivateKey(privateKeyPem);
    const keyBuffer = pemToArrayBuffer(formatted, "PRIVATE");

    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        keyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["decrypt"]
    );

    const ciphertext = Uint8Array.from(atob(ciphertextB64), c => c.charCodeAt(0));
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        ciphertext
    );
    return new TextDecoder().decode(decrypted);
}

// Sign with sender's private key
export async function signMessage(privateKeyPem, message) {
    const formatted = formatPrivateKey(privateKeyPem);
    const keyBuffer = pemToArrayBuffer(formatted, "PRIVATE");

    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        keyBuffer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const encoded = new TextEncoder().encode(message);
    const signature = await window.crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        privateKey,
        encoded
    );
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// Verify signature with sender's public key
export async function verifySignature(publicKeyPem, message, signatureB64) {
    const formatted = formatPublicKey(publicKeyPem);
    const keyBuffer = pemToArrayBuffer(formatted, "PUBLIC");

    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        keyBuffer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"]
    );

    const encoded = new TextEncoder().encode(message);
    const signature = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
    return await window.crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        publicKey,
        signature,
        encoded
    );
}