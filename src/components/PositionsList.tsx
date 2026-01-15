"use client";

export default function PositionsList() {
  const mock = [
    { id: 'p1', symbol: 'EUR/USD', side: 'Long', size: 1.2, entry: 1.1023, pl: 24 },
    { id: 'p2', symbol: 'GBP/USD', side: 'Short', size: 0.5, entry: 1.2567, pl: -12 },
  ];

  return (
    <div className="bg-dark-card border border-gold-500/10 rounded-xl p-4">
      <h3 className="font-medium text-gold-500">Open Positions</h3>
      <div className="mt-3 space-y-2">
        {mock.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-3 rounded bg-gray-900 border border-gray-800">
            <div>
              <div className="font-semibold">{m.symbol} <span className="text-sm text-gray-400">{m.side}</span></div>
              <div className="text-xs text-gray-500">Size {m.size} · Entry {m.entry}</div>
            </div>
            <div className={`font-medium ${m.pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{m.pl >= 0 ? '+' : ''}{m.pl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
