**Project Overview**
- **Purpose:** A secure, end-to-end encrypted chat application demonstrating client-side key management, cryptographic sign-in (challenge–response), and private messaging between users.
- **Stack:** MERN (MongoDB, Express, React, Node) with WebSocket-based real-time messaging.

**Core Concepts**
- **Public/Private Key Pairs:** Each user generates an asymmetric key pair. The public key is stored on the server; the private key never leaves the client and is used to sign authentication challenges and decrypt message secrets.
- **Server-Signed Key Exports (PDF):** When the client exports keys (for example into a downloadable PDF), the server can optionally provide a signature or signed fingerprint for that export so users can verify the PDF's authenticity. Verification uses the server's signing public key (see [backend/utils/serverSignature.js](backend/utils/serverSignature.js)) — the client checks the server signature against the PDF's fingerprint or signed metadata before trusting the file.
- **Challenge–Response Authentication:** Instead of sending passwords, the server issues a random challenge; the client signs it with their private key and returns the signature for server-side verification using the stored public key.
- **Hybrid Encryption for Messages:** To keep message payloads small and efficient, the app uses hybrid encryption: symmetric keys (e.g., AES-GCM) encrypt the message body and are themselves encrypted with the recipient's public key (asymmetric encryption or via an agreed shared secret).
- **Server Role:** The server routes encrypted messages and stores public keys and metadata. It never has access to users' private keys or to plaintext message contents.

**Algorithms & Cryptography**
- **Asymmetric Key Algorithms:** The app uses Web Crypto / node crypto APIs to generate key pairs (RSA or EC depending on implementation). See [backend/utils/generateKeyPair.js](backend/utils/generateKeyPair.js) and client utilities.
- **Signatures:** Challenge signing uses a secure signature algorithm (e.g., RSASSA-PKCS1-v1_5 or ECDSA). The server verifies signatures against the stored public key (see [backend/utils/serverSignature.js](backend/utils/serverSignature.js)).
- **Symmetric Encryption:** Message bodies are encrypted with an authenticated symmetric cipher (recommended: AES-GCM). Symmetric keys are ephemeral and rotated per message or session.
- **Hybrid Pattern:** Symmetric keys are wrapped with the recipient's public key (RSA-OAEP or via an ECDH-derived shared secret), enabling efficient message encryption with strong forward secrecy when combined with per-message keys.

**Sign-In Flow (Challenge–Response)**
- **Step 1 — Client key generation / registration:** On registration, the client generates a key pair locally and uploads only the public key to the server. The private key is exported to a file or stored locally (protected by user-chosen passphrase). The project uses utilities like [src/utils/createKeysPdf.js](src/utils/createKeysPdf.js) to let users preserve their keys.
- **Step 2 — Login request:** The client requests to authenticate; the server issues a random challenge (nonce) tied to the session.
- **Step 3 — Client signs challenge:** The client signs the challenge with the private key (see [src/utils/signChallenge.js](src/utils/signChallenge.js)) and returns the signature.
- **Step 4 — Server verifies:** The server retrieves the user's public key and verifies the signature. If valid, the server issues a session token (JWT) or upgrades the WebSocket connection for real-time messaging.

**End-to-End Encryption (E2EE) Message Flow**
- **Key Discovery:** When Alice wants to message Bob, she fetches Bob's public key from the server (public keys are public metadata).
- **Encrypting a Message:** Alice generates a fresh symmetric key, encrypts the plaintext with AES-GCM, then encrypts (wraps) the symmetric key with Bob's public key. The client sends the wrapped key + ciphertext to the server.
- **Delivering & Decrypting:** The server forwards the wrapped key + ciphertext to Bob. Bob unwraps the symmetric key using his private key and decrypts the ciphertext locally.
- **Group & Forward Secrecy Notes:** For one-to-one chats this hybrid approach is straightforward. To achieve forward secrecy for long-lived sessions, integrate ephemeral ECDH exchanges per session or per message to derive ephemeral symmetric keys.

**Files of Interest**
- **Auth & Keys:** [backend/utils/generateKeyPair.js](backend/utils/generateKeyPair.js), [backend/utils/serverSignature.js](backend/utils/serverSignature.js), [src/utils/validatePrivateKey.js](src/utils/validatePrivateKey.js)
- **Client Crypto Helpers:** [src/utils/pemToArrayBuffer.js](src/utils/pemToArrayBuffer.js), [src/utils/signChallenge.js](src/utils/signChallenge.js), [src/utils/messageFlow.js](src/utils/messageFlow.js)
- **Server Routes & Socket:** [backend/routes/auth.js](backend/routes/auth.js), [backend/socket/index.js](backend/socket/index.js), [backend/socketHandlers/messageHandler.js](backend/socketHandlers/messageHandler.js)

**Security Considerations & Best Practices**
- **Private Key Safety:** Never transmit private keys to the server. Protect exported private keys with a strong passphrase and encourage users to back them up offline.
- **Use Authenticated Encryption:** Always use AEAD (e.g., AES-GCM) for message payloads to prevent tampering and ciphertext malleability.
- **Rotate Ephemeral Keys:** Use ephemeral symmetric keys per message or short-lived session keys derived from ECDH for stronger forward secrecy.
- **Protect Metadata:** While message bodies are encrypted, metadata (sender, recipient, timestamps) may still be visible to the server — treat metadata leakage as a risk and minimize what is stored.

**Conclusion**
- **Summary:** This project demonstrates a practical, real-world approach to building a secure chat app: client-side key generation, challenge–response authentication, and hybrid end-to-end encryption for messages, with the server acting only as an encrypted-message router and public-key directory.
- **Try It Live:** Explore the running demo at https://secure2ee.vercel.app/ to see the secure chat flow in action.

If you'd like, I can also add a short developer section with setup and run instructions, or inline code pointers for where to adjust the cryptographic algorithms (e.g., switch RSA → ECDH/ECDSA).

**Developer Setup & Run**
- **Clone the repository:**

```bash
git clone https://github.com/ahmedehabcs/chatApp.git
cd chatApp
```

- **Run the frontend (root project):**

```bash
npm install
npm run dev
```

- **Run the backend:**

```bash
cd backend
npm install
npm start
```

- Notes:
	- Ensure you have Node.js and npm installed (recommended Node 16+).
	- If the backend requires environment variables, create a `.env` file in `backend` and `frontend` before starting.


