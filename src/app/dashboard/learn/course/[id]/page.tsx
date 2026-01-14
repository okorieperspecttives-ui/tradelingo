'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

type Params = { id: string };

const coursesMeta: Record<string, { title: string; lessons: { slug: string; title: string }[] }> = {
  'forex-foundations': {
    title: 'Forex Basics',
    lessons: [
      { slug: 'what-is-a-pip', title: 'What is a Pip?' },
      { slug: 'currency-pairs', title: 'Currency Pairs' },
    ],
  },
};

export default function CourseDetailPage({ params }: { params: Params }) {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string | null>(null);
  const [lessons, setLessons] = useState<{ slug: string; title: string }[] | null>(null);
  const meta = coursesMeta[params.id];

  useEffect(() => {
    let active = true;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      const enr = await supabase.from('enrollments').select('user_id,course_id').eq('user_id', user.id).eq('course_id', params.id).maybeSingle();
      if (!active) return;
      setEnrolled(!!enr.data && !enr.error);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [user, params.id]);

  const canViewLessons = useMemo(() => enrolled || params.id !== 'forex-foundations', [enrolled, params.id]);

  useEffect(() => {
    let active = true;
    async function loadData() {
      const courseRes = await supabase.from('courses').select('id,title').eq('id', params.id).maybeSingle();
      if (courseRes.data && !courseRes.error) {
        setTitle(courseRes.data.title as string);
      } else if (meta) {
        setTitle(meta.title);
      }
      const lessonsRes = await supabase.from('lessons').select('slug,title').eq('course_id', params.id).order('order', { ascending: true });
      if (active && lessonsRes.data && !lessonsRes.error && lessonsRes.data.length > 0) {
        setLessons(lessonsRes.data as { slug: string; title: string }[]);
      } else if (active && meta) {
        setLessons(meta.lessons);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [params.id]);

  if (!meta) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Course</h1>
          <p className="text-gray-400 mt-2">This course is coming soon.</p>
          <Link href="/dashboard/learn" className="mt-4 inline-block px-5 py-2 rounded-lg border border-gold-500/20 text-gold-500 cursor-pointer">Back</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-gray-400">Loading…</div>;

  if (!user && params.id === 'forex-foundations') {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">{title ?? meta.title}</h1>
          <p className="text-gray-400 mt-2">Sign in to enroll and start the course.</p>
          <Link href="/signin" className="mt-4 inline-block px-5 py-2 rounded-lg bg-gold-500 text-black cursor-pointer">Sign In</Link>
        </div>
      </div>
    );
  }

  if (!canViewLessons) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">{title ?? meta.title}</h1>
          <p className="text-gray-400 mt-2">Enroll to unlock lessons in this curated course.</p>
          <Link href="/dashboard/learn" className="mt-4 inline-block px-5 py-2 rounded-lg border border-gold-500/20 text-gold-500 cursor-pointer">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-gold-500">{title ?? meta.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(lessons ?? meta.lessons).map((ls) => (
          <Link
            key={ls.slug}
            href={`/dashboard/learn/lesson/${ls.slug}`}
            className="block bg-dark-card p-6 rounded-xl border border-gold-500/10 hover:border-gold-500/20 transition cursor-pointer"
          >
            <h3 className="text-xl font-serif text-gold-500">{ls.title}</h3>
            <p className="text-gray-400 mt-1">Tap to start this lesson</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
