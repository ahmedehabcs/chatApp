import { formatPublicKey, formatPrivateKey } from "./formatKeys";

export async function createVerificationHash(publicKey, privateKey) {
    const formattedPublicKey = formatPublicKey(publicKey);
    const formattedPrivateKey = formatPrivateKey(privateKey);
    const data = formattedPublicKey + formattedPrivateKey;
    const hashBuffer = await crypto.subtle.digest( 'SHA-256',  new TextEncoder().encode(data));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}