import { FiUserPlus, FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="cta-title" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="cta-title" className="text-4xl font-bold mb-6">
            Ready for Private Conversations?
          </h2>
          <p className="text-xl text-white opacity-80 mb-10">
            Join thousands who value privacy. Sign up to generate your keys and start encrypted chats immediately.
          </p>
          <nav aria-label="Final actions" className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <FiUserPlus size={20} aria-hidden /> Create Free Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-transparent border border-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              <FiLogIn size={20} aria-hidden /> Existing User
            </button>
          </nav>
        </div>
      </div>
    </section>
  );
}