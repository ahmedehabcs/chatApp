function pemToArrayBuffer(pem) {
  const base64 = pem.replace(/-----\w+ PRIVATE KEY-----/g, "").replace(/\s+/g, "");
  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return binary.buffer;
}

export async function signChallenge(privateKeyPem, challenge) {
  const binaryDer = pemToArrayBuffer(privateKeyPem);
  const key = await window.crypto.subtle.importKey( "pkcs8", binaryDer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const encoder = new TextEncoder();
  const data = encoder.encode(challenge);
  const signature = await window.crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, data);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}