"use client";

type Entry = { rank: number; name: string; xp: number; level: number };

export default function LeaderboardList({ entries = [] as Entry[] }: { entries?: Entry[] }) {
  const data = entries.length
    ? entries
    : [
        { rank: 1, name: 'Alex', xp: 4520, level: 12 },
        { rank: 2, name: 'Sam', xp: 3980, level: 11 },
        { rank: 3, name: 'Jordan', xp: 3720, level: 10 },
        { rank: 4, name: 'Taylor', xp: 3400, level: 9 },
        { rank: 5, name: 'Casey', xp: 3100, level: 9 },
      ];

  return (
    <div className="bg-dark-card border border-gold-500/10 rounded-xl p-4">
      <h3 className="font-medium text-gold-500">Leaderboard</h3>
      <ol className="mt-3 space-y-2">
        {data.map((e) => (
          <li key={e.rank} className="flex items-center justify-between p-3 rounded bg-gray-900 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center font-bold text-black">{e.rank}</div>
              <div>
                <div className="font-semibold">{e.name}</div>
                <div className="text-xs text-gray-500">Level {e.level}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300">{e.xp} XP</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
