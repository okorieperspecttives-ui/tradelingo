import LeaderboardList from '@/components/LeaderboardList';

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-gold-500">Leaderboard</h1>
          <p className="text-gray-400">See top learners, XP leaders, and recent rank changes.</p>
        </div>
        <div className="text-sm text-gray-400">Filter: All time · All courses</div>
      </div>

      <LeaderboardList />
    </div>
  );
}
