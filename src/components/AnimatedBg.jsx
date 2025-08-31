export function AnimatedBubbles() {
	return (
		<div className="absolute inset-0 overflow-hidden -z-10">
			<div className="absolute top-250 left-0 w-[500px] h-[500px] bg-[var(--color-main-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-move-bg-1"></div>
			<div className="absolute top-100 right-0 w-[400px] h-[400px] bg-[var(--color-secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-move-bg-2"></div>
			<div className="absolute bottom-100 left-1/2 w-[600px] h-[600px] bg-[var(--color-info)] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-move-bg-3"></div>
		</div>
	);
}
export function AnimatedWaves() {
	return (
		<div className="absolute inset-0 overflow-hidden -z-10">
			<div className="absolute top-0 left-0 w-[800px] h-[600px] bg-[var(--color-main-light)] opacity-10 filter blur-3xl animate-wave-1" style={{ clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 70%)" }}></div>
			<div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-[var(--color-secondary-light)] opacity-10 filter blur-3xl animate-wave-2" style={{ clipPath: "polygon(0 70%, 100% 30%, 100% 100%, 0 100%)" }}></div>
		</div>
	);
}
export function AnimatedTriangles() {
	return (
		<div className="absolute inset-0 overflow-hidden -z-10">
			<div className="absolute top-10 left-10 w-[400px] h-[400px] bg-[var(--color-main-light)] opacity-15 filter blur-3xl animate-float-1" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
			<div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[var(--color-secondary-light)] opacity-15 filter blur-3xl animate-float-2" style={{ clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)" }}></div>
			<div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[var(--color-info)] opacity-10 filter blur-3xl animate-float-3" style={{ clipPath: "polygon(0% 50%, 50% 0%, 50% 100%)" }}></div>
		</div>
	);
}
export function AnimatedGrid() {
	return (
		<div className="absolute inset-0 overflow-hidden -z-10">
			<div className="absolute inset-0 opacity-5 animate-grid-pulse" style={{ backgroundImage: ` linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)`, backgroundSize: "40px 40px" }}></div>
			<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-main-light)/10] to-[var(--color-secondary-light)/10]"></div>
		</div>
	);
}
export function AnimatedBlobs() {
	return (
		<div className="absolute inset-0 overflow-hidden -z-10">
			<div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[var(--color-main-light)] opacity-20 filter blur-3xl animate-blob-1" style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}></div>
			<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--color-secondary-light)] opacity-20 filter blur-3xl animate-blob-2" style={{ borderRadius: "67% 33% 47% 53% / 37% 41% 59% 63%" }}></div>
			<div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[var(--color-info)] opacity-15 filter blur-3xl animate-blob-3" style={{ borderRadius: "63% 37% 56% 44% / 25% 66% 34% 75%" }}></div>
		</div>
	);
}