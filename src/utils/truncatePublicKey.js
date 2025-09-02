export default function truncatePublicKey(publicKey, maxLength = 30) {
    if (!publicKey) return "";
    return publicKey.length > maxLength ? publicKey.slice(0, maxLength).toUpperCase() + "..." : publicKey.toUpperCase();
}