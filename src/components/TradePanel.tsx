"use client";

import { useState } from 'react';

export default function TradePanel() {
  const [symbol, setSymbol] = useState('EUR/USD');
  const [size, setSize] = useState(1);
  const [side, setSide] = useState<'buy'|'sell'>('buy');

  return (
    <div className="bg-dark-card border border-gold-500/10 rounded-xl p-4 space-y-4">
      <h3 className="font-medium text-gold-500">Trade</h3>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-gray-400">Symbol
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} className="mt-1 w-full px-3 py-2 rounded bg-gray-900 border border-gray-800 text-white" />
        </label>
        <label className="text-sm text-gray-400">Size
          <input type="number" min={0.01} step={0.01} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-1 w-full px-3 py-2 rounded bg-gray-900 border border-gray-800 text-white" />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setSide('buy')} className={`px-3 py-2 rounded ${side === 'buy' ? 'bg-gold-500 text-black' : 'border border-gold-500/20 text-gold-500'}`}>Buy</button>
        <button onClick={() => setSide('sell')} className={`px-3 py-2 rounded ${side === 'sell' ? 'bg-red-500 text-black' : 'border border-gold-500/20 text-gold-500'}`}>Sell</button>
        <div className="ml-auto text-sm text-gray-400">Est. Fee: 0.1%</div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 rounded bg-gold-500 text-black font-semibold">Place Market</button>
        <button className="px-4 py-2 rounded border border-gold-500/20 text-gold-500">Place Limit</button>
      </div>
    </div>
  );
}
