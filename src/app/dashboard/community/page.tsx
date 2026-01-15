import CommunityComposer from '@/components/CommunityComposer';
import CommunityFeed from '@/components/CommunityFeed';

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-gold-500">The Pit</h1>
          <p className="text-gray-400">Share trade ideas, vote bullish/bearish, and discuss with the community.</p>
        </div>
        <div className="text-sm text-gray-400">Trending: EUR/USD · #risk-management</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <CommunityComposer />
          <CommunityFeed />
        </div>

        <aside className="space-y-4">
          <div className="bg-dark-card border border-gold-500/10 rounded-xl p-4">
            <h3 className="font-medium text-gold-500">Top Contributors</h3>
            <ul className="mt-3 space-y-2 text-gray-300">
              <li>Alex · 12 pts</li>
              <li>Sam · 9 pts</li>
              <li>Jordan · 8 pts</li>
            </ul>
          </div>

          <div className="bg-dark-card border border-gold-500/10 rounded-xl p-4">
            <h3 className="font-medium text-gold-500">Rules</h3>
            <ol className="mt-2 text-sm text-gray-400 space-y-1">
              <li>Be constructive.</li>
              <li>No private info.</li>
              <li>Back claims with reasoning.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

