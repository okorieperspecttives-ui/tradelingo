'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

type ProfileRow = {
  id: string;
  path_position: number | null;
};

type Unit = {
  id: number;
  title: string;
  subtitle: string;
};

const units: Unit[] = [
  { id: 0, title: 'Foundations', subtitle: 'What is a Pip?' },
  { id: 1, title: 'Candlesticks', subtitle: 'Bullish and Bearish Patterns' },
  { id: 2, title: 'Support & Resistance', subtitle: 'Key Levels' },
  { id: 3, title: 'Risk Management', subtitle: 'Position Sizing' },
  { id: 4, title: 'Chart Patterns', subtitle: 'Triangles, Flags, Wedges' },
];

export default function LearnPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState<boolean>(false);
  const courseId = 'forex-foundations';

  useEffect(() => {
    let active = true;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('profiles').select('id,path_position').eq('id', user.id).single();
      if (!active) return;
      if (error) {
        setProfile({ id: user.id, path_position: 0 });
      } else {
        setProfile(data as ProfileRow);
      }
      const enr = await supabase.from('enrollments').select('user_id,course_id').eq('user_id', user.id).eq('course_id', courseId).maybeSingle();
      setEnrolled(!!enr.data && !enr.error);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [user]);

  const current = useMemo(() => profile?.path_position ?? 0, [profile]);

  if (!user) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Start Learning</h1>
          <p className="text-gray-400 mt-2">Structured units from basics to strategy with interactive lessons.</p>
          <div className="mt-4">
            <Link href="/signin" className="inline-block px-5 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition cursor-pointer">Sign In</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {units.map((u) => (
            <div key={u.id} className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
              <h3 className="text-xl font-serif text-gold-500 mb-1">{u.title}</h3>
              <p className="text-gray-400">{u.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading…</div>;
  }

  async function enroll() {
    if (!user) return;
    const { error } = await supabase.from('enrollments').upsert({ user_id: user.id, course_id: courseId }, { onConflict: 'user_id,course_id', ignoreDuplicates: true });
    if (!error) setEnrolled(true);
  }

  if (!enrolled) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Enroll to Start</h1>
          <p className="text-gray-400 mt-2">Courses are free. Enroll to unlock your curated path from start to finish.</p>
          <button
            className="mt-4 px-5 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition cursor-pointer"
            onClick={enroll}
            type="button"
          >
            Enroll Free
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {units.map((u) => (
            <div key={u.id} className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
              <h3 className="text-xl font-serif text-gold-500 mb-1">{u.title}</h3>
              <p className="text-gray-400">{u.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-gold-500">Your Units</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {units.map((u) => {
          const isCurrent = u.id === current;
          const isCompleted = u.id < current;
          const isLocked = u.id > current;
          return (
            <div
              key={u.id}
              className="bg-dark-card p-6 rounded-xl border border-gold-500/10 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-gold-500">{u.title}</h3>
                {isCompleted && <span className="px-2 py-1 text-xs rounded bg-gold-500/10 text-gold-500">Completed</span>}
                {isCurrent && <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-500">Current</span>}
                {isLocked && <span className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">Locked</span>}
              </div>
              <p className="text-gray-400">{u.subtitle}</p>
              <div className="mt-auto">
                {isCurrent ? (
                  <button className="px-4 py-2 rounded-lg bg-gold-500 text-black font-semibold cursor-pointer">Continue</button>
                ) : isLocked ? (
                  <button className="px-4 py-2 rounded-lg bg-gray-800 text-gray-500 font-semibold cursor-not-allowed">Locked</button>
                ) : (
                  <button className="px-4 py-2 rounded-lg bg-gold-500/10 text-gold-500 border border-gold-500/20 font-semibold cursor-pointer">Review</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
