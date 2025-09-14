import { useState, useRef } from "react";
import { FiShield, FiKey, FiLock, FiDownload, FiCheck } from "react-icons/fi";
import { createVerificationHash } from "../../utils/createVerificationHash.js";
import { useNavigate } from "react-router-dom";
import { downloadKeys } from "../../api/auth.js";
import KeyCard from "./KeyCard";
import ActionCard from "./ActionCard";

export default function KeysDashboard({ publicKey, privateKey, setShowPopup }) {
    const [copiedPublic, setCopiedPublic] = useState(false);
    const [copiedPrivate, setCopiedPrivate] = useState(false);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();


    const handleCopy = (keyType, keyValue) => {
        navigator.clipboard.writeText(keyValue);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (keyType === "public") {
            setCopiedPublic(true);
            timeoutRef.current = setTimeout(() => setCopiedPublic(false), 2000);
        } else {
            setCopiedPrivate(true);
            timeoutRef.current = setTimeout(() => setCopiedPrivate(false), 2000);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        navigate("/login");
    };

    const handleDownloadKeys = async () => {
        try {
            setLoading(true);
            const { createKeysPdf } = await import("../../utils/createKeysPdf.js");
            const verHash = await createVerificationHash(publicKey, privateKey);
            const res = await downloadKeys(verHash);
            const pdfBlob = await createKeysPdf(publicKey, privateKey, res.signature);
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "keys.pdf";
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="py-8">
            <section className="w-full">
                {/* Header */}
                <header className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-main)] to-[var(--color-main-light)] flex items-center justify-center text-white shadow-lg">
                        <FiShield size={32} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                        Your Security Keys
                    </h1>
                    <p className="mt-2 text-sm md:text-base text-[var(--color-text-light)] max-w-2xl mx-auto">
                        Save both keys securely. This is your only chance to back them up before proceeding.
                    </p>
                </header>
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <KeyCard
                        icon={<FiKey className="text-[var(--color-info)]" />}
                        iconColor="bg-[var(--color-info)]"
                        title="Public Key"
                        subtitle="Share this key freely!"
                        label="Share safely"
                        keyValue={publicKey}
                        copied={copiedPublic}
                        onCopy={() => handleCopy("public", publicKey)}
                        textColor="text-[var(--color-info)]"
                    />

                    <KeyCard
                        icon={<FiLock className="text-[var(--color-warning)]" />}
                        iconColor="bg-[var(--color-warning)]"
                        title="Private Key"
                        subtitle="Never share this key. Store it securely offline."
                        label="Top secret"
                        keyValue={privateKey}
                        copied={copiedPrivate}
                        onCopy={() => handleCopy("private", privateKey)}
                        textColor="text-[var(--color-warning)]"
                    />
                </section>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ActionCard
                        title="Download Backup"
                        description="Save both keys in a secure file for offline storage."
                        buttonText={`${loading ? "Generating..." : "Download File"}`}
                        buttonIcon={<FiDownload size={18} />}
                        onClick={handleDownloadKeys}
                        bgClasses="bg-gradient-to-r from-[var(--color-main)]/20 to-[var(--color-secondary)]/20"
                        btnClasses="bg-gradient-to-r from-[var(--color-main)] to-[var(--color-secondary)] text-white"
                    />

                    <ActionCard
                        title="Ready to Continue"
                        description="They cannot be recovered if lost."
                        buttonText="I've Saved My Keys"
                        buttonIcon={<FiCheck />}
                        onClick={handleClosePopup}
                        bgClasses="bg-[var(--color-success-bg)]/50"
                        textColor="text-[var(--color-success)]"
                        btnClasses="bg-[var(--color-success)] text-white"
                    />
                </section>
                <footer className="text-center mt-6">
                    <p className="text-md text-[var(--color-text-light)]">
                        ⚠️ Keys are generated once and cannot be recovered. Store them securely.
                    </p>
                </footer>
            </section>
        </main>
    );
}