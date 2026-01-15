"use client";

import { useState } from 'react';

export default function SimulatorControls() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);

  return (
    <div className="bg-dark-card border border-gold-500/10 rounded-xl p-4 flex items-center gap-4">
      <button onClick={() => setRunning((r) => !r)} className={`px-4 py-2 rounded ${running ? 'bg-red-500 text-black' : 'bg-gold-500 text-black'}`}>
        {running ? 'Pause' : 'Start'}
      </button>
      <div className="flex-1">
        <label className="text-sm text-gray-400">Speed: {speed}x</label>
        <input type="range" min={0.25} max={4} step={0.25} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
      </div>
      <div className="text-sm text-gray-400">Sim Time: 00:12:34</div>
    </div>
  );
}
