import SimulatorChart from '@/components/SimulatorChart';
import TradePanel from '@/components/TradePanel';
import PositionsList from '@/components/PositionsList';
import SimulatorControls from '@/components/SimulatorControls';

export default function SimulatorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-gold-500">Simulator</h1>
          <p className="text-gray-400">Practice trades with gamified rules and scoring. Use real-ish market moves to train decision-making.</p>
        </div>
        <div className="text-sm text-gray-400">Mode: Practice · Difficulty: Intermediate</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <SimulatorChart />
          <SimulatorControls />
        </div>

        <div className="space-y-4">
          <TradePanel />
          <PositionsList />
        </div>
      </div>
    </div>
  );
}

