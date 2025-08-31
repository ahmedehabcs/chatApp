import { useNavigate } from "react-router-dom";
import { FiLock, FiShield, FiUsers, FiZap, FiLogIn, FiUserPlus } from "react-icons/fi";
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
							End-to-end encrypted messaging that keeps your conversations truly
							private
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
								title: "Military-Grade Encryption",
								desc: "All messages are encrypted end-to-end with AES-256, the same standard used by governments.",
							},
							{
								icon: (
									<FiShield
										size={32}
										className="text-[var(--color-secondary)]"
									/>
								),
								title: "No Data Collection",
								desc: "We don't store your messages or metadata. Your conversations stay private.",
							},
							{
								icon: (
									<FiZap size={32} className="text-[var(--color-success)]" />
								),
								title: "Lightning Fast",
								desc: "Experience real-time messaging with minimal latency and maximum reliability.",
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
								desc: "Sign up to instantly receive your unique public and private keys.",
							},
							{
								step: "2",
								title: "Verify with Your Private Key",
								desc: "Use your private key to securely sign in and prove your identity.",
							},
							{
								step: "3",
								title: "Start Encrypted Chats",
								desc: "Share your public key with friends and chat privately in real-time.",
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

			{/* Testimonials Section */}
			<section className="py-20 relative overflow-hidden">
				<div className="container mx-auto px-6 z-10">
					<h2 className="text-4xl font-bold text-center mb-16">
						Trusted by Thousands
					</h2>

					<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
						{[
							{
								name: "Sarah Johnson",
								role: "Journalist",
								quote:
									"As someone who deals with sensitive information daily, this platform gives me peace of mind.",
							},
							{
								name: "Michael Chen",
								role: "Lawyer",
								quote:
									"The only messaging app I recommend to my clients for attorney-client privilege.",
							},
							{
								name: "Emma Rodriguez",
								role: "Healthcare Professional",
								quote:
									"HIPAA-compliant messaging has never been this easy and secure.",
							},
							{
								name: "David Wilson",
								role: "Business Executive",
								quote:
									"Our board communications require absolute confidentiality - this delivers.",
							},
						].map((testimonial, index) => (
							<div
								key={index}
								className="bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all"
							>
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 rounded-full bg-[var(--color-main-bg)] flex items-center justify-center text-[var(--color-main)] mr-4">
										<FiUsers size={20} />
									</div>
									<div>
										<h4 className="font-bold">{testimonial.name}</h4>
										<p className="text-sm text-[var(--color-text-light)]">
											{testimonial.role}
										</p>
									</div>
								</div>
								<p className="text-[var(--color-text-light)] italic">
									"{testimonial.quote}"
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 relative overflow-hidden">
				<div className="container mx-auto px-6 z-10">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-4xl font-bold mb-6">
							Ready for Private Conversations?
						</h2>
						<p className="text-xl text-white opacity-80 mb-10">
							Join thousands who value their privacy. Get started in seconds.
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