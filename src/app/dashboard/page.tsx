'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  

  if (!user) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Discover TradeLingo</h1>
          <p className="text-gray-400 mt-2">Learn forex, practice trades, and grow with a community.</p>
          <div className="mt-4">
            <Link href="/signin" className="inline-block px-5 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition cursor-pointer">Get Started</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
            <h3 className="text-xl font-serif text-gold-500 mb-2">Structured Learning</h3>
            <p className="text-gray-400">Units and lessons that build fundamentals and strategies step by step.</p>
          </div>
          <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
            <h3 className="text-xl font-serif text-gold-500 mb-2">Trade Simulator</h3>
            <p className="text-gray-400">Risk-free practice with gamified rules, streaks, and performance scoring.</p>
          </div>
          <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
            <h3 className="text-xl font-serif text-gold-500 mb-2">Community</h3>
            <p className="text-gray-400">Share ideas, vote bullish/bearish, and discuss market sentiment in real time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
            <h3 className="text-xl font-serif text-gold-500 mb-2">Leaderboards</h3>
            <p className="text-gray-400">Compete, climb ranks, and track your progress against peers.</p>
          </div>
          <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
            <h3 className="text-xl font-serif text-gold-500 mb-2">Personalized Path</h3>
            <p className="text-gray-400">Adaptive goals tailored to your skill level and performance.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Capital</p>
            <h3 className="text-2xl font-bold text-white">$100,000.00</h3>
          </div>
          <div className="text-gold-500 bg-gold-500/10 p-3 rounded-full">💰</div>
        </div>
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Current Streak</p>
            <h3 className="text-2xl font-bold text-white">5 Days</h3>
          </div>
          <div className="text-orange-500 bg-orange-500/10 p-3 rounded-full">🔥</div>
        </div>
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Rank</p>
            <h3 className="text-2xl font-bold text-white">Retail Trader</h3>
          </div>
          <div className="text-blue-500 bg-blue-500/10 p-3 rounded-full">🏆</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-serif text-gold-500 mb-6">Your Path</h2>
        <div className="relative max-w-2xl mx-auto space-y-12">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2 z-0"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center border-4 border-dark-bg shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer hover:scale-110 transition-transform">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="mt-2 bg-dark-card px-4 py-2 rounded-lg border border-gold-500/20 text-center">
              <p className="text-gold-500 font-bold">Unit 1</p>
              <p className="text-sm text-gray-400">Foundations</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border-4 border-dark-bg text-gray-500 cursor-not-allowed">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="mt-2 text-center opacity-50">
              <p className="text-gray-400 font-bold">Unit 2</p>
              <p className="text-sm text-gray-500">Candlesticks</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border-4 border-dark-bg text-gray-500 cursor-not-allowed">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
