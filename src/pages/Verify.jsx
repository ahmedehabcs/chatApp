import { useState, useRef } from "react";
import { FiKey, FiCheckCircle, FiXCircle, FiDownload, FiFile, FiSearch, FiLoader, FiLogIn, FiUserPlus, FiClipboard } from "react-icons/fi";
import { verifySignature } from "../api/auth";
import { createVerificationHash } from "../utils/createVerificationHash";
import { AnimatedWaves } from "../components/AnimatedBg.jsx";
import { useNavigate } from "react-router-dom";

export default function Verify() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    const publicInputRef = useRef(null);
    const privateInputRef = useRef(null);
    const signatureInputRef = useRef(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccess(null);
            setLoading(true);

            const publicKey = publicInputRef.current.value;
            const privateKey = privateInputRef.current.value;
            const signature = signatureInputRef.current.value;

            if (!publicKey?.trim()) return setError("Public key is required");
            if (!privateKey?.trim()) return setError("Private key is required");
            if (!signature?.trim()) return setError("Signature is required");

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

    const handlePaste = async (inputRef) => {
        try {
            const text = await navigator.clipboard.readText();
            if (inputRef.current) {
                inputRef.current.value = text;
                // Trigger change event to update any state that might depend on the input value
                const event = new Event('input', { bubbles: true });
                inputRef.current.dispatchEvent(event);
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            // Fallback for browsers that don't support clipboard API
            if (inputRef.current) {
                inputRef.current.focus();
                document.execCommand('paste');
            }
        }
    };

    const instructionImages = ["/public.jpg", "/private.jpg", "/signature.jpg"];
    const instructions = [
        {
            title: "Public Key",
            description: "Your public key is included in the generated PDF under the 'Keys' section.",
            icon: <FiKey className="text-[var(--color-text-light)]" />,
            btnBgColor: "--color-secondary"
        },
        {
            title: "Private Key",
            description: "Your private key is stored securely inside the generated PDF document.",
            icon: <FiDownload className="text-[var(--color-error)]" />,
            btnBgColor: "--color-error"
        },
        {
            title: "Signature",
            description: "The signature can be found at the end of the generated PDF along with the verification details.",
            icon: <FiFile className="text-[var(--color-info)]" />,
            btnBgColor: "--color-info"
        }
    ];

    return (
        <main className="min-h-screen relative grass-dark text-[var(--color-text)] p-4 md:p-6 lg:p-8">
            <AnimatedWaves />
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-main)] mb-2">
                        Document Verification Portal
                    </h1>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
                        Verify the authenticity of your documents using your security keys
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Instruction Section */}
                    <section className="p-4 md:p-6 rounded-xl shadow-lg border border-[var(--color-border)]">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FiSearch className="text-[var(--color-main)]" />
                            Where to Find Your Keys
                        </h2>

                        <div className="mb-6">
                            <p className="text-[var(--color-text-light)] mb-4">
                                You can retrieve your verification keys from the following locations in your document:
                            </p>

                            {/* Tabs for instructions */}
                            <div className="flex space-x-2 mb-4">
                                {instructions.map((instruction, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTab(index)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === index
                                            ? `bg-[var(${instruction.btnBgColor})] text-[var(--color-text-inverse)]`
                                            : 'bg-[var(--color-bg)] text-[var(--color-text-light)] hover:bg-[var(--color-border)]'
                                            }`}
                                    >
                                        {instruction.title}
                                    </button>
                                ))}
                            </div>

                            {/* Active instruction content */}
                            <div className="p-4 rounded-lg mb-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="text-2xl">{instructions[activeTab].icon}</div>
                                    <h3 className="text-lg font-semibold">{instructions[activeTab].title}</h3>
                                </div>
                                <p className="text-[var(--color-text-light)] text-sm">
                                    {instructions[activeTab].description}
                                </p>
                            </div>

                            {/* Instruction image */}
                            <div className="rounded-lg overflow-hidden border border-[var(--color-border)]">
                                <img
                                    src={instructionImages[activeTab]}
                                    alt={`Location of ${instructions[activeTab].title}`}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Form Section */}
                    <section className="p-4 md:p-6 rounded-xl shadow-lg border border-[var(--color-border)]">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-main)]">
                            <FiKey /> Verify Document Authenticity
                        </h2>

                        <form onSubmit={handleVerify} className="space-y-4">
                            {/* Public Key Input with Paste Button */}
                            <div>
                                <label htmlFor="publicKey" className="block text-sm font-medium mb-1 text-[var(--color-text-light)]">
                                    Public Key
                                </label>
                                <div className="relative">
                                    <input
                                        id="publicKey"
                                        ref={publicInputRef}
                                        placeholder="Enter your public key"
                                        className="w-full p-3 pr-10 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handlePaste(publicInputRef)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-[var(--color-text-light)] hover:text-[var(--color-main)] transition-colors"
                                        title="Paste from clipboard"
                                    >
                                        <FiClipboard />
                                    </button>
                                </div>
                            </div>

                            {/* Private Key Input with Paste Button */}
                            <div>
                                <label htmlFor="privateKey" className="block text-sm font-medium mb-1 text-[var(--color-text-light)]">
                                    Private Key
                                </label>
                                <div className="relative">
                                    <input
                                        id="privateKey"
                                        ref={privateInputRef}
                                        placeholder="Enter your private key"
                                        className="w-full p-3 pr-10 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handlePaste(privateInputRef)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-[var(--color-text-light)] hover:text-[var(--color-main)] transition-colors"
                                        title="Paste from clipboard"
                                    >
                                        <FiClipboard />
                                    </button>
                                </div>
                            </div>

                            {/* Signature Input with Paste Button */}
                            <div>
                                <label htmlFor="signature" className="block text-sm font-medium mb-1 text-[var(--color-text-light)]">
                                    Signature
                                </label>
                                <div className="relative">
                                    <input
                                        id="signature"
                                        ref={signatureInputRef}
                                        placeholder="Enter the document signature"
                                        className="w-full p-3 pr-10 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handlePaste(signatureInputRef)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-[var(--color-text-light)] hover:text-[var(--color-main)] transition-colors"
                                        title="Paste from clipboard"
                                    >
                                        <FiClipboard />
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div
                                    role="alert"
                                    className="flex items-center gap-2 text-[var(--color-error)] bg-[var(--color-error-bg)] p-3 rounded-lg text-sm"
                                >
                                    <FiXCircle className="flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            {success && (
                                <div
                                    role="status"
                                    className="flex items-center gap-2 text-[var(--color-success)] bg-[var(--color-success-bg)] p-3 rounded-lg text-sm"
                                >
                                    <FiCheckCircle className="flex-shrink-0" />
                                    <span>{success}</span>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-lg font-semibold transition-colors bg-[var(--color-main)] text-[var(--color-text-inverse)] hover:bg-[var(--color-main-hover)] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <FiLoader className="animate-spin h-5 w-5 text-white" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Document"
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                {/* Additional help section */}
                <div className="mt-8 p-4 md:p-6 rounded-xl shadow-lg border border-[var(--color-border)] text-center">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--color-main)]">
                        Ready to Continue?
                    </h3>
                    <p className="text-[var(--color-text-light)] text-sm mb-4">
                        To access your keys and verify documents, please log in to your account
                        or create a new one if you haven't yet.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-[var(--color-main)] text-[var(--color-text-inverse)] hover:bg-[var(--color-main-hover)]"
                        >
                            <FiLogIn /> Log In
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-[var(--color-secondary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-secondary-hover)]"
                        >
                            <FiUserPlus /> Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}