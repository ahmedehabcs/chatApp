import { AnimatedBubbles, AnimatedTriangles } from "../components/AnimatedBg.jsx";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Verification from "../components/home/Verification";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer";

export default function LandingPage() {
	return (
		<main className="min-h-screen grass-dark text-[var(--color-text)]">
			<AnimatedTriangles />
			<AnimatedBubbles />
			<Hero />
			<Features />
			<HowItWorks />
			<Verification />
			<CTA />
			<Footer />
		</main>
	);
}