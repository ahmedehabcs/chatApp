export function formatPublicKey(publicKey) {
    const cleaned = publicKey
        .replace(/-----BEGIN ?PUBLIC KEY-----/g, "")
        .replace(/-----END ?PUBLIC KEY-----/g, "")
        .replace(/\s+/g, "");
    const body = cleaned.match(/.{1,64}/g)?.join("\n") || "";
    return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`;
}

export function formatPrivateKey(privateKey) {
    const cleaned = privateKey
        .replace(/-----BEGIN ?PRIVATE KEY-----/g, "")
        .replace(/-----END ?PRIVATE KEY-----/g, "")
        .replace(/\s+/g, "");
    const body = cleaned.match(/.{1,64}/g)?.join("\n") || "";
    return `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----`;
}