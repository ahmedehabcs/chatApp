import { FiShield, FiUserPlus, FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section aria-labelledby="hero-title" className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-6 z-10">
                <header className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center bg-[var(--color-surface)]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--color-border)] mb-8 animate-fade-in">
                        <FiShield className="text-[var(--color-main)] mr-2" aria-hidden />
                        <span className="text-sm">Military-grade encryption</span>
                    </div>
                    <h1 id="hero-title" className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                        Secure <span className="text-[var(--color-main)]">Private</span> Chats
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--color-text-light)] mb-10 max-w-3xl mx-auto animate-fade-in delay-100">
                        End-to-end encrypted messaging with RSA challenge-response authentication.
                        Your private key <strong className="text-[var(--color-main)] font-medium">never leaves</strong> your device.
                    </p>
                    <nav aria-label="Primary actions" className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
                        <button onClick={() => navigate("/register")} className="px-8 py-4 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            <FiUserPlus size={20} aria-hidden /> Get Started
                        </button>
                        <button onClick={() => navigate("/login")} className="px-8 py-4 bg-transparent border border-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[var(--color-bg-dark)] hover:-translate-y-0.5 transition-all">
                            <FiLogIn size={20} aria-hidden /> Sign In
                        </button>
                    </nav>
                </header>
            </div>
        </section>
    );
}