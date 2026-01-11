import { FiCheckSquare, FiDownload, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Verification() {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="verify-title" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <header className="max-w-5xl mx-auto text-center mb-16">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-main)]/10 flex items-center justify-center mx-auto mb-6">
            <FiCheckSquare size={36} className="text-[var(--color-main)]" />
          </div>
          <h2 id="verify-title" className="text-4xl md:text-5xl font-extrabold mb-6">
            Verify Your <span className="text-[var(--color-main)]">Documents</span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-light)] max-w-2xl mx-auto leading-relaxed">
            Ensure authenticity and integrity of your files with our secure cryptographic verification system.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <article className="p-8 rounded-3xl transition-all">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-main)]/10">
                <FiDownload className="text-[var(--color-main)]" size={24} />
              </div>
              <h3 className="text-2xl font-bold">Download First</h3>
            </div>
            <p className="text-[var(--color-text-light)] mb-5">
              Make sure you’ve downloaded the document from our secure platform before verifying.
            </p>
            <ul className="space-y-3 text-[var(--color-text-light)]">
              <li className="flex items-center gap-2"><span className="text-[var(--color-main)]">✔</span> Cryptographically signed</li>
              <li className="flex items-center gap-2"><span className="text-[var(--color-main)]">✔</span> Unique digital fingerprint</li>
              <li className="flex items-center gap-2"><span className="text-[var(--color-main)]">✔</span> Signature breaks if tampered</li>
            </ul>
          </article>

          <article className="p-8 rounded-3xl transition-all">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-secondary)]/10">
                <FiShield className="text-[var(--color-secondary)]" size={24} />
              </div>
              <h3 className="text-2xl font-bold">Then Verify</h3>
            </div>
            <p className="text-[var(--color-text-light)] mb-5">
              Use our verification tool to confirm your document’s integrity and authenticity.
            </p>
            <ul className="space-y-3 text-[var(--color-text-light)]">
              <li className="flex items-center gap-2"><span className="text-[var(--color-secondary)]">✔</span> Guarantees integrity</li>
              <li className="flex items-center gap-2"><span className="text-[var(--color-secondary)]">✔</span> Confirms authenticity</li>
              <li className="flex items-center gap-2"><span className="text-[var(--color-secondary)]">✔</span> Protects from tampering</li>
            </ul>
          </article>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate(`/verify`)}
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-sm sm:text-lg bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-text-inverse)] shadow-md hover:shadow-lg transition-all gap-3"
          >
            <FiCheckSquare size={22} aria-hidden /> Verify Your Document
          </button>
          <p className="text-[var(--color-text-light)] mt-4 text-sm md:text-base">
            Built with the same cryptographic principles that protect your chats.
          </p>
        </div>
      </div>
    </section>
  );
}