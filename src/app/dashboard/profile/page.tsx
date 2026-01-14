'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

type ProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  streak_days: number;
  xp: number;
  capital: number;
  rank: string | null;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('id,username,full_name,avatar_url,role,streak_days,xp,capital,rank')
        .eq('id', user.id)
        .single();
      if (!active) return;
      if (error) {
        setError(error.message);
        setProfile(null);
      } else {
        setProfile(data as ProfileRow);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Profile</h1>
          <p className="text-gray-400 mt-2">Sign in to view and edit your profile.</p>
          <div className="mt-4">
            <Link href="/signin" className="inline-block px-5 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition cursor-pointer">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading profile…</div>;
  }

  const displayName = profile?.full_name || profile?.username || user.email || 'User';
  const rank = profile?.rank || 'Retail Trader';
  const role = profile?.role || 'user';
  const streak = profile?.streak_days ?? 0;
  const xp = profile?.xp ?? 0;
  const capital = profile?.capital ?? 0;

  return (
    <div className="space-y-6">
      <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-black font-bold">
          {(displayName || 'U').slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-serif text-gold-500">{displayName}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <div className="px-3 py-1 rounded-md border border-gold-500/20 text-gold-500">{role}</div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Rank</p>
            <h3 className="text-2xl font-bold text-white">{rank}</h3>
          </div>
          <div className="text-blue-500 bg-blue-500/10 p-3 rounded-full">🏆</div>
        </div>
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Streak</p>
            <h3 className="text-2xl font-bold text-white">{streak} Days</h3>
          </div>
          <div className="text-orange-500 bg-orange-500/10 p-3 rounded-full">🔥</div>
        </div>
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">XP</p>
            <h3 className="text-2xl font-bold text-white">{xp}</h3>
          </div>
          <div className="text-purple-500 bg-purple-500/10 p-3 rounded-full">⭐</div>
        </div>
      </div>

      <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
        <h2 className="text-xl font-serif text-gold-500 mb-2">Account Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gold-500/10 rounded-lg">
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-white">{user.email}</p>
          </div>
          <div className="p-4 border border-gold-500/10 rounded-lg">
            <p className="text-gray-400 text-sm">Capital</p>
            <p className="text-white">${capital.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
