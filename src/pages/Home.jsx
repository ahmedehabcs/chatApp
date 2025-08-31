import { useNavigate } from "react-router-dom";
import { FiLock, FiShield, FiZap, FiLogIn, FiUserPlus } from "react-icons/fi";
import { AnimatedBubbles, AnimatedTriangles } from "../components/AnimatedBg.jsx";

export default function LandingPage() {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen backdrop-blur-3xl bg-[#000000] text-[var(--color-text)]">
			<AnimatedTriangles />
			<AnimatedBubbles />

			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				<div className="container mx-auto px-6 z-10">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
							Secure <span className="text-[var(--color-main)]">Private</span>{" "}
							Chats
						</h1>
						<p className="text-xl md:text-2xl text-[var(--color-text-light)] mb-10 max-w-3xl mx-auto animate-fade-in delay-100">
							We use RSA public/private keys and digital signatures to authenticate users securely.
							Your private key never leaves your device. All messages are end-to-end encrypted, 
							ensuring only intended recipients can read them.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
							<button
								onClick={() => navigate("/register")}
								className="px-8 py-4 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white rounded-xl font-bold text-lg hover:from-[var(--color-main-hover)] hover:to-[var(--color-main)] transition-all flex items-center justify-center gap-2"
							>
								<FiUserPlus size={20} /> Get Started
							</button>
							<button
								onClick={() => navigate("/login")}
								className="px-8 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl font-bold text-lg hover:bg-[var(--color-bg)] transition-all flex items-center justify-center gap-2"
							>
								<FiLogIn size={20} /> Sign In
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 relative overflow-hidden">
				<div className="container mx-auto px-6 z-10">
					<h2 className="text-4xl font-bold text-center mb-16">
						Why Choose Our Secure Chat
					</h2>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: <FiLock size={32} className="text-[var(--color-main)]" />,
								title: "RSA Challenge-Response",
								desc: "Authenticate securely using digital signatures. Your private key never leaves your device.",
							},
							{
								icon: <FiShield size={32} className="text-[var(--color-secondary)]" />,
								title: "End-to-End Encryption",
								desc: "All messages are encrypted with AES-256, ensuring only recipients can read them.",
							},
							{
								icon: <FiZap size={32} className="text-[var(--color-success)]" />,
								title: "Fast & Reliable",
								desc: "Real-time messaging with minimal latency, keeping your conversations smooth and private.",
							},
						].map((feature, index) => (
							<div
								key={index}
								className="bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all"
							>
								<div className="w-16 h-16 rounded-full bg-[var(--color-main-bg)] flex items-center justify-center mb-6">
									{feature.icon}
								</div>
								<h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
								<p className="text-[var(--color-text-light)]">{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-20 relative overflow-hidden">
				<div className="container mx-auto px-6 z-10">
					<h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

					<div className="max-w-4xl mx-auto">
						{[
							{
								step: "1",
								title: "Generate Your Keys",
								desc: "Sign up to receive a unique RSA public/private key pair. Keep your private key safe on your device.",
							},
							{
								step: "2",
								title: "Sign Challenges to Authenticate",
								desc: "Use your private key to sign server-generated challenges. This proves your identity without exposing your key.",
							},
							{
								step: "3",
								title: "Start Encrypted Chats",
								desc: "Share your public key with friends to chat privately. All messages are encrypted end-to-end.",
							},
						].map((item, index) => (
							<div
								key={index}
								className="flex flex-col md:flex-row items-start mb-12 last:mb-0 group"
							>
								<div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-2xl font-bold text-[var(--color-main)] mb-4 md:mb-0 md:mr-8 group-hover:bg-[var(--color-main)] group-hover:text-white transition-all">
									{item.step}
								</div>
								<div className="flex-1">
									<h3 className="text-2xl font-bold mb-2">{item.title}</h3>
									<p className="text-[var(--color-text-light)]">{item.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 relative overflow-hidden">
				<div className="container mx-auto px-6 z-10">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-4xl font-bold mb-6">Ready for Private Conversations?</h2>
						<p className="text-xl text-white opacity-80 mb-10">
							Join thousands who value privacy. Sign up to generate your keys and start encrypted chats immediately.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								onClick={() => navigate("/register")}
								className="px-8 py-4 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white rounded-xl font-bold text-lg hover:from-[var(--color-main-hover)] hover:to-[var(--color-main)] transition-all flex items-center justify-center gap-2"
							>
								<FiUserPlus size={20} /> Create Free Account
							</button>
							<button
								onClick={() => navigate("/login")}
								className="px-8 py-4 bg-transparent border border-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
							>
								<FiLogIn size={20} /> Existing User
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}