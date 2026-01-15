'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

type ProfileRow = {
  id: string;
  path_position: number | null;
  role?: string | null;
};

type Course = {
  id: string;
  title: string;
  subtitle: string;
  published: boolean;
  image_url?: string | null;
  order?: number;
};

export default function LearnPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([
    { id: 'forex-foundations', title: 'Forex Basics', subtitle: 'Start here to learn fundamentals', published: true, image_url: null, order: 1 },
    { id: 'candlesticks-101', title: 'Candlesticks 101', subtitle: 'Patterns and psychology', published: false, image_url: null, order: 2 },
    { id: 'risk-management-101', title: 'Risk Management 101', subtitle: 'Position sizing and safety first', published: false, image_url: null, order: 3 },
  ]);
  const courseId = 'forex-foundations';

  useEffect(() => {
    let active = true;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('profiles').select('id,path_position,role').eq('id', user.id).single();
      if (!active) return;
      if (error) {
        setProfile({ id: user.id, path_position: 0, role: null });
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

  useEffect(() => {
    let active = true;
    async function fetchCourses() {
      const res = await supabase.from('courses').select('id,title,subtitle,published,image_url,order').order('order', { ascending: true });
      if (!active) return;
      if (res.data && !res.error && Array.isArray(res.data) && res.data.length > 0) {
        setCourses(res.data as Course[]);
      }
    }
    fetchCourses();
    return () => {
      active = false;
    };
  }, []);

  const current = useMemo(() => profile?.path_position ?? 0, [profile]);

  if (!user) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Start Learning</h1>
          <p className="text-gray-400 mt-2">Courses contain lessons curated from basics to advanced.</p>
          <div className="mt-4">
            <Link href="/signin" className="inline-block px-5 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition cursor-pointer">Sign In</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Link key={c.id} href={`/dashboard/learn/course/${c.id}`} className="block">
              <div className="bg-dark-card p-0 rounded-xl border border-gold-500/10 hover:border-gold-500/20 transition overflow-hidden">
                <div className="aspect-[16/9] bg-gray-900">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">Course Image</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif text-gold-500">{c.title}</h3>
                    {!c.published && <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400">Coming Soon</span>}
                  </div>
                  <p className="text-gray-400">{c.subtitle}</p>
                </div>
              </div>
            </Link>
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

  const featured = courses[0];

  const isTeacher = (profile?.role ?? '').toLowerCase() === 'teacher';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-gold-500">Courses</h1>
        {isTeacher && (
          <Link
            href="/dashboard/learn/course/new"
            className="px-4 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition cursor-pointer"
          >
            Create Course
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="bg-dark-card p-0 rounded-xl border border-gold-500/10 overflow-hidden">
            <div className="aspect-[16/9] bg-gray-900">
              {c.image_url ? (
                <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">Course Image</div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-gold-500">{c.title}</h3>
                {!c.published && <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400">Coming Soon</span>}
              </div>
              <p className="text-gray-400">{c.subtitle}</p>
              <div className="mt-4 flex items-center gap-3">
                {c.id === featured.id && !enrolled ? (
                  <button className="px-4 py-2 rounded-lg bg-gold-500 text-black font-semibold cursor-pointer" onClick={enroll} type="button">
                    Enroll Free
                  </button>
                ) : null}
                <Link href={`/dashboard/learn/course/${c.id}`} className="px-4 py-2 rounded-lg border border-gold-500/20 text-gold-500 font-semibold cursor-pointer">
                  View Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
