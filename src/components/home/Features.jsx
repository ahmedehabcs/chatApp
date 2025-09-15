import { FiLock, FiShield, FiZap } from "react-icons/fi";

export default function Features() {
  const features = [
    {
      icon: <FiLock size={32} className="text-[var(--color-main)]" />,
      title: "RSA Challenge-Response",
      desc: "Authenticate securely using digital signatures. Your private key never leaves your device.",
      color: "--color-main",
    },
    {
      icon: <FiShield size={32} className="text-[var(--color-secondary)]" />,
      title: "End-to-End Encryption",
      desc: "All messages are encrypted with AES-256, ensuring only recipients can read them.",
      color: "--color-secondary",
    },
    {
      icon: <FiZap size={32} className="text-[var(--color-success)]" />,
      title: "Fast & Reliable",
      desc: "Real-time messaging with minimal latency, keeping your conversations smooth and private.",
      color: "--color-warning",
    },
  ];

  return (
    <section aria-labelledby="features-title" className="py-20 relative overflow-hidden">
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
          {features.map((feature, index) => (
            <article key={index} className="p-8 rounded-2xl transition-all hover:-translate-y-2 group">
              <div className={`w-16 h-16 rounded-lg bg-[var(--color-main-bg)] border-1 border-[var(${feature.color})] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[var(--color-text-light)]">{feature.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}