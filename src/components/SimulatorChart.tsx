"use client";

export default function SimulatorChart() {
  return (
    <div className="bg-gradient-to-b from-gray-900/40 to-transparent rounded-xl p-4 h-80 flex items-center justify-center border border-gold-500/10">
      <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#D4AF37" stopOpacity="0.15" />
            <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="transparent" />
        <polyline fill="url(#g)" stroke="#D4AF37" strokeWidth="2" points="0,220 80,200 160,180 240,210 320,150 400,170 480,140 560,160 640,120 720,130 800,100" />
      </svg>
    </div>
  );
}
