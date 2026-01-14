'use client';

export default function MotionBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
      <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <g className="bg-shape-1" style={{ transformOrigin: '200px 200px' }}>
          <circle cx="200" cy="200" r="220" fill="var(--color-gold-500)" opacity="0.08" />
        </g>
        <g className="bg-shape-2" style={{ transformOrigin: '1240px 300px' }}>
          <circle cx="1240" cy="300" r="260" fill="var(--color-gold-300)" opacity="0.06" />
        </g>
        <g className="bg-shape-3" style={{ transformOrigin: '720px 700px' }}>
          <circle cx="720" cy="700" r="300" fill="var(--color-gold-700)" opacity="0.05" />
        </g>
      </svg>
    </div>
  );
}

