export function pemPrivateToArrayBuffer(pem) {
    const base64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/g, "")
        .replace(/-----END PRIVATE KEY-----/g, "")
        .replace(/\s+/g, "");
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    return binary.buffer;
}

export function pemPublicToArrayBuffer(pem) {
    const base64 = pem
        .replace(/-----BEGIN PUBLIC KEY-----/g, "")
        .replace(/-----END PUBLIC KEY-----/g, "")
        .replace(/\s+/g, "");
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    return binary.buffer;
}