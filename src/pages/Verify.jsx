import { useState, useRef } from "react";
import { FiKey, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { verifySignature } from "../api/auth";
import { createVerificationHash } from "../utils/createVerificationHash";

export default function Verify() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const publicInputRef = useRef(null);
    const privateInputRef = useRef(null);
    const signatureInputRef = useRef(null);

    const handleVerify = async () => {
        try {
            setError(null);
            setSuccess(null);
            setLoading(true);

            const publicKey = publicInputRef.current.value;
            const privateKey = privateInputRef.current.value;
            const signature = signatureInputRef.current.value;

            if (!publicKey || !publicKey.trim()) return setError("Public key is required");
            if (!privateKey || !privateKey.trim()) return setError("Private key is required");
            if (!signature || !signature.trim()) return setError("Signature is required");

            const verHash = await createVerificationHash(publicKey, privateKey);
            const res = await verifySignature(verHash, signature);

            if (res.valid) {
                setSuccess("Signature verified successfully ✅");
            } else {
                setError("Invalid signature ❌");
            }
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to verify document authenticity.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-[var(--color-bg-dark)] text-[var(--color-text)] p-6">
            <div className="w-full max-w-lg bg-[var(--color-surface)] p-6 rounded-xl shadow-lg border border-[var(--color-border)] space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--color-main)]">
                    <FiKey /> Verify Keys
                </h2>

                <input
                    ref={publicInputRef}
                    placeholder="Enter Public Key"
                    className="w-full p-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-light)] focus:outline-none focus:border-[var(--color-main)]"
                />
                <input
                    ref={privateInputRef}
                    placeholder="Enter Private Key"
                    className="w-full p-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-light)] focus:outline-none focus:border-[var(--color-main)]"
                />
                <input
                    ref={signatureInputRef}
                    placeholder="Enter Signature"
                    className="w-full p-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-light)] focus:outline-none focus:border-[var(--color-main)]"
                />

                {error && (
                    <p className="flex items-center gap-2 text-[var(--color-error)] bg-[var(--color-error-bg)] p-2 rounded-lg text-sm">
                        <FiXCircle /> {error}
                    </p>
                )}
                {success && (
                    <p className="flex items-center gap-2 text-[var(--color-success)] bg-[var(--color-success-bg)] p-2 rounded-lg text-sm">
                        <FiCheckCircle /> {success}
                    </p>
                )}

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full py-2 rounded-lg font-semibold transition-colors bg-[var(--color-main)] text-[var(--color-text-inverse)] hover:bg-[var(--color-main-hover)] disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>
            </div>
        </section>
    );
}
