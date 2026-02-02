import { AnimatedBubbles, AnimatedTriangles } from "../components/AnimatedBg.jsx";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Verification from "../components/home/Verification";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer";

export default function LandingPage() {
	return (
		<main className="relative min-h-screen bg-black text-[var(--color-text)] overflow-x-hidden">
			<div className="fixed inset-0 backdrop-blur-2xl pointer-events-none z-0" />
			<div className="relative z-10">
				<AnimatedTriangles />
				<AnimatedBubbles />
				<Hero />
				<Features />
				<HowItWorks />
				<Verification />
				<CTA />
				<Footer />
			</div>
		</main>
	);
}