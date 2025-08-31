export async function signChallenge(privateKeyPem, challenge) {
  const binaryDerString = window.atob(
    privateKeyPem.replace(/-----\w+ PRIVATE KEY-----/g, "").replace(/\s+/g, "")
  );
  const binaryDer = new Uint8Array([...binaryDerString].map((c) => c.charCodeAt(0)));

  const key = await window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const encoder = new TextEncoder();
  const data = encoder.encode(challenge);

  const signature = await window.crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, data);

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}