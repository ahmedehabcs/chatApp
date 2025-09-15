export default function HowItWorks() {
  const steps = [
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
  ];

  return (
    <section aria-labelledby="how-title" className="py-20 relative overflow-hidden">
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
          {steps.map((item, index) => (
            <li key={index} className="flex flex-col md:flex-row items-start mb-12 last:mb-0 group">
              <div className="flex justify-center items-center gap-4 md:gap-0">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-2xl font-bold text-[var(--color-main)] mb-4 md:mb-0 md:mr-8 group-hover:bg-[var(--color-main)] group-hover:text-white transition-all group-hover:scale-110 shadow-md">
                  {item.step}
                </div>
                <h3 className="md:hidden block text-2xl font-bold mb-2">{item.title}</h3>
              </div>
              <div className="flex-1 md:border-l md:border-[var(--color-border)] md:pl-8 md:pt-2">
                <h3 className="hidden md:block text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-[var(--color-text-light)]">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}