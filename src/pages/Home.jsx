import { useNavigate } from "react-router-dom";
import { FiLock, FiShield, FiZap, FiLogIn, FiUserPlus, FiCheckSquare, FiDownload } from "react-icons/fi";
import { AnimatedBubbles, AnimatedTriangles } from "../components/AnimatedBg.jsx";

export default function LandingPage() {
	const navigate = useNavigate();

	return (
		<main className="min-h-screen grass-dark text-[var(--color-text)]">
			<AnimatedTriangles />
			<AnimatedBubbles />

			{/* Hero Section */}
			<section
				aria-labelledby="hero-title"
				className="relative h-screen flex items-center justify-center overflow-hidden"
			>
				<div className="container mx-auto px-6 z-10">
					<header className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center bg-[var(--color-surface)]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--color-border)] mb-8 animate-fade-in">
							<FiShield className="text-[var(--color-main)] mr-2" aria-hidden />
							<span className="text-sm">Military-grade encryption</span>
						</div>
						<h1
							id="hero-title"
							className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in"
						>
							Secure <span className="text-[var(--color-main)]">Private</span>{" "}
							Chats
						</h1>
						<p className="text-xl md:text-2xl text-[var(--color-text-light)] mb-10 max-w-3xl mx-auto animate-fade-in delay-100">
							End-to-end encrypted messaging with RSA challenge-response
							authentication. Your private key{" "}
							<strong className="text-[var(--color-main)] font-medium">
								never leaves
							</strong>{" "}
							your device.
						</p>
						<nav
							aria-label="Primary actions"
							className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200"
						>
							<button
								onClick={() => navigate("/register")}
								className="px-8 py-4 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white rounded-xl font-bold text-lg hover:from-[var(--color-main-hover)] hover:to-[var(--color-main)] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
							>
								<FiUserPlus size={20} aria-hidden /> Get Started
							</button>
							<button
								onClick={() => navigate("/login")}
								className="px-8 py-4 bg-transparent border border-white rounded-xl font-bold text-lg hover:bg-[var(--color-bg-dark)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
							>
								<FiLogIn size={20} aria-hidden /> Sign In
							</button>
						</nav>
					</header>
				</div>
			</section>

			{/* Features Section */}
			<section
				aria-labelledby="features-title"
				className="py-20 relative overflow-hidden"
			>
				<div className="container mx-auto px-6 z-10">
					<header className="text-center mb-16">
						<h2 id="features-title" className="text-4xl font-bold mb-4">
							Why Choose Our Secure Chat
						</h2>
						<p className="text-xl text-[var(--color-text-light)] max-w-2xl mx-auto">
							Built with privacy-first principles and cutting-edge cryptography
						</p>
					</header>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: (
									<FiLock size={32} className="text-[var(--color-main)]" />
								),
								title: "RSA Challenge-Response",
								desc: "Authenticate securely using digital signatures. Your private key never leaves your device.",
								color: "--color-main",
							},
							{
								icon: (
									<FiShield
										size={32}
										className="text-[var(--color-secondary)]"
									/>
								),
								title: "End-to-End Encryption",
								desc: "All messages are encrypted with AES-256, ensuring only recipients can read them.",
								color: "--color-secondary",
							},
							{
								icon: (
									<FiZap size={32} className="text-[var(--color-success)]" />
								),
								title: "Fast & Reliable",
								desc: "Real-time messaging with minimal latency, keeping your conversations smooth and private.",
								color: "--color-warning",
							},
						].map((feature, index) => (
							<article
								key={index}
								className="p-8 rounded-2xl transition-all hover:-translate-y-2 group"
							>
								<div
									className={`w-16 h-16 rounded-lg bg-[var(--color-main-bg)] border-1 border-[var(${feature.color})] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
								>
									{feature.icon}
								</div>
								<h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
								<p className="text-[var(--color-text-light)]">{feature.desc}</p>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section
				aria-labelledby="how-title"
				className="py-20 relative overflow-hidden"
			>
				<div className="container mx-auto px-6 z-10">
					<header className="text-center mb-16">
						<h2 id="how-title" className="text-4xl font-bold mb-4">
							How It Works
						</h2>
						<p className="text-xl text-[var(--color-text-light)] max-w-2xl mx-auto">
							Three simple steps to complete privacy and security
						</p>
					</header>

					<ol className="max-w-4xl mx-auto">
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
							<li
								key={index}
								className="flex flex-col md:flex-row items-start mb-12 last:mb-0 group"
							>
								<div className="flex justify-center items-center gap-4 md:gap-0">
									<div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-2xl font-bold text-[var(--color-main)] mb-4 md:mb-0 md:mr-8 group-hover:bg-[var(--color-main)] group-hover:text-white transition-all group-hover:scale-110 shadow-md">
										{item.step}
									</div>
									<h3 className="md:hidden block text-2xl font-bold mb-2">
										{item.title}
									</h3>
								</div>

								<div className="flex-1 md:border-l md:border-[var(--color-border)] md:pl-8 md:pt-2">
									<h3 className="hidden md:block text-2xl font-bold mb-2">
										{item.title}
									</h3>
									<p className="text-[var(--color-text-light)]">{item.desc}</p>
								</div>
							</li>
						))}
					</ol>
				</div>
			</section>

			{/* Verification Section */}
			<section
				aria-labelledby="verify-title"
				className="py-24 relative overflow-hidden"
			>
				<div className="container mx-auto px-6 relative z-10">
					<header className="max-w-5xl mx-auto text-center mb-16">
						<div className="w-20 h-20 rounded-2xl bg-[var(--color-main)]/10 flex items-center justify-center mx-auto mb-6">
							<FiCheckSquare size={36} className="text-[var(--color-main)]" />
						</div>
						<h2
							id="verify-title"
							className="text-4xl md:text-5xl font-extrabold mb-6"
						>
							Verify Your{" "}
							<span className="text-[var(--color-main)]">Documents</span>
						</h2>
						<p className="text-lg md:text-xl text-[var(--color-text-light)] max-w-2xl mx-auto leading-relaxed">
							Ensure authenticity and integrity of your files with our secure
							cryptographic verification system.
						</p>
					</header>

					{/* Steps */}
					<div className="grid md:grid-cols-2 gap-10 mb-16">
						<article className="p-8 rounded-3xl transition-all">
							<div className="flex items-center gap-4 mb-5">
								<div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-main)]/10">
									<FiDownload className="text-[var(--color-main)]" size={24} />
								</div>
								<h3 className="text-2xl font-bold">Download First</h3>
							</div>
							<p className="text-[var(--color-text-light)] mb-5">
								Make sure you’ve downloaded the document from our secure
								platform before verifying.
							</p>
							<ul className="space-y-3 text-[var(--color-text-light)]">
								<li className="flex items-center gap-2">
									<span className="text-[var(--color-main)]">✔</span>
									<span>Cryptographically signed</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="text-[var(--color-main)]">✔</span>
									<span>Unique digital fingerprint</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="text-[var(--color-main)]">✔</span>
									<span>Signature breaks if tampered</span>
								</li>
							</ul>
						</article>

						<article className="p-8 rounded-3xl transition-all">
							<div className="flex items-center gap-4 mb-5">
								<div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-secondary)]/10">
									<FiShield
										className="text-[var(--color-secondary)]"
										size={24}
									/>
								</div>
								<h3 className="text-2xl font-bold">Then Verify</h3>
							</div>
							<p className="text-[var(--color-text-light)] mb-5">
								Use our verification tool to confirm your document’s integrity
								and authenticity.
							</p>
							<ul className="space-y-3 text-[var(--color-text-light)]">
								<li className="flex items-center gap-2">
									<span className="text-[var(--color-secondary)]">✔</span>
									<span>Guarantees integrity</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="text-[var(--color-secondary)]">✔</span>
									<span>Confirms authenticity</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="text-[var(--color-secondary)]">✔</span>
									<span>Protects from tampering</span>
								</li>
							</ul>
						</article>
					</div>

					{/* CTA */}
					<div className="text-center">
						<button
							onClick={() => navigate(`/verify`)}
							className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-text-inverse)] shadow-md hover:shadow-lg transition-all gap-3"
						>
							<FiCheckSquare size={22} aria-hidden />
							Verify Your Document Now
						</button>
						<p className="text-[var(--color-text-light)] mt-4 text-sm md:text-base">
							Built with the same cryptographic principles that protect your
							chats.
						</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section
				aria-labelledby="cta-title"
				className="py-20 relative overflow-hidden"
			>
				<div className="container mx-auto px-6 z-10">
					<div className="max-w-4xl mx-auto text-center">
						<h2 id="cta-title" className="text-4xl font-bold mb-6">
							Ready for Private Conversations?
						</h2>
						<p className="text-xl text-white opacity-80 mb-10">
							Join thousands who value privacy. Sign up to generate your keys
							and start encrypted chats immediately.
						</p>
						<nav
							aria-label="Final actions"
							className="flex flex-col sm:flex-row gap-4 justify-center"
						>
							<button
								onClick={() => navigate("/register")}
								className="px-8 py-4 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white rounded-xl font-bold text-lg hover:from-[var(--color-main-hover)] hover:to-[var(--color-main)] transition-all flex items-center justify-center gap-2"
							>
								<FiUserPlus size={20} aria-hidden /> Create Free Account
							</button>
							<button
								onClick={() => navigate("/login")}
								className="px-8 py-4 bg-transparent border border-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
							>
								<FiLogIn size={20} aria-hidden /> Existing User
							</button>
						</nav>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-10 border-t border-[var(--color-border)]">
				<div className="container mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center mb-4 md:mb-0">
							<div className="bg-[var(--color-main)] rounded-full p-2 mr-2">
								<FiLock
									className="text-[var(--color-text-inverse)]"
									size={18}
									aria-hidden
								/>
							</div>
							<span className="font-bold text-xl text-[var(--color-text)]">
								AhmedEhab
							</span>
						</div>
						<small className="text-[var(--color-text-light)] text-sm">
							© {new Date().getFullYear()} AhmedEhab. All rights reserved.
						</small>
					</div>
				</div>
			</footer>
		</main>
	);
}