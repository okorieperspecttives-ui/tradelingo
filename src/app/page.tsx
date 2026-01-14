export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-dark-bg">
      <div className="text-center space-y-6">
        <h1 className="font-serif text-4xl text-gold-500">TradeLingo</h1>
        <p className="text-gray-400">Premium forex learning with a modern, gold aesthetic.</p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition"
        >
          Enter Dashboard
        </a>
      </div>
    </main>
  );
}

