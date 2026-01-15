'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { toast } from 'react-toastify';

type Lesson = {
  slug: string;
  title: string;
  content_html: string | null;
  quiz_json: any | null;
  order: number;
  xp: number;
};

export default function LessonViewPage({ params }: { params: { id: string; slug: string } }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scorePct, setScorePct] = useState<number>(0);

  useEffect(() => {
    let active = true;
    async function load() {
      const lr = await supabase
        .from('lessons')
        .select('slug,title,content_html,quiz_json,order,xp')
        .eq('course_id', params.id)
        .eq('slug', params.slug)
        .maybeSingle();
      const ar = await supabase
        .from('lessons')
        .select('slug,title,content_html,quiz_json,order,xp')
        .eq('course_id', params.id)
        .order('order', { ascending: true });
      if (!active) return;
      if (!lr.error && lr.data) {
        setLesson(lr.data as Lesson);
      }
      if (!ar.error && ar.data) {
        setAllLessons(ar.data as Lesson[]);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [params.id, params.slug]);

  const idx = useMemo(() => allLessons.findIndex((l) => l.slug === params.slug), [allLessons, params.slug]);
  const prevSlug = useMemo(() => (idx > 0 ? allLessons[idx - 1]?.slug : null), [idx, allLessons]);
  const nextSlug = useMemo(() => (idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1]?.slug : null), [idx, allLessons]);

  function onSelect(qi: number, oi: number) {
    setAnswers((a) => ({ ...a, [String(qi)]: oi }));
  }

  async function submitQuiz() {
    const qs = lesson?.quiz_json?.questions ?? [];
    const total = qs.length;
    let correct = 0;
    qs.forEach((q: any, qi: number) => {
      const choose = answers[String(qi)];
      if (typeof choose === 'number') {
        const opt = q.options?.[choose];
        if (opt?.correct) correct += 1;
      }
    });
    const pct = total > 0 ? Math.round((correct / total) * 100) : 100;
    setScorePct(pct);
    setSubmitted(true);
    try {
      if (user) {
        await supabase
          .from('quiz_attempts')
          .insert({
            user_id: user.id,
            lesson_id: lesson ? `${params.id}:${lesson.slug}` : `${params.id}:${params.slug}`,
            correct_count: correct,
            total_count: total,
          });
        if (pct >= 70) {
          await supabase
            .from('user_progress')
            .upsert(
              { user_id: user.id, lesson_id: lesson ? `${params.id}:${lesson.slug}` : `${params.id}:${params.slug}`, status: 'completed' },
              { onConflict: 'user_id,lesson_id', ignoreDuplicates: true }
            );
        }
      }
    } catch {}
    toast.success(pct >= 70 ? 'Passed' : 'Keep trying');
  }

  if (loading) return <div className="p-8 text-gray-400">Loading…</div>;
  if (!lesson) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Lesson</h1>
          <p className="text-gray-400 mt-2">Lesson not found.</p>
          <Link href={`/dashboard/learn/course/${params.id}`} className="mt-4 inline-block px-5 py-2 rounded-lg border border-gold-500/20 text-gold-500 cursor-pointer">
            Back
          </Link>
        </div>
      </div>
    );
  }

  const qs = lesson.quiz_json?.questions ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
        <h1 className="font-serif text-2xl text-gold-500">{lesson.title}</h1>
        {lesson.content_html ? (
          <div className="prose prose-invert max-w-none mt-4" dangerouslySetInnerHTML={{ __html: lesson.content_html }} />
        ) : null}
      </div>

      {qs.length > 0 && (
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 space-y-4">
          <h3 className="text-xl font-serif text-gold-500">Quiz</h3>
          <div className="space-y-4">
            {qs.map((q: any, qi: number) => (
              <div key={qi} className="space-y-2">
                <p className="text-gray-300">{q.prompt}</p>
                <div className="space-y-2">
                  {(q.options ?? []).map((opt: any, oi: number) => (
                    <button
                      key={oi}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition cursor-pointer ${
                        answers[String(qi)] === oi ? 'border-gold-500 text-gold-500 bg-gold-500/10' : 'border-gray-800 text-gray-300 hover:border-gold-500/30'
                      }`}
                      onClick={() => onSelect(qi, oi)}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-5 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
              onClick={submitQuiz}
              type="button"
            >
              Submit
            </button>
            {submitted && scorePct >= 70 && nextSlug && (
              <Link
                href={`/dashboard/learn/course/${params.id}/lesson/${nextSlug}`}
                className="px-5 py-2 rounded-lg bg-blue-500 text-black font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Next Lesson
              </Link>
            )}
            {prevSlug && (
              <Link
                href={`/dashboard/learn/course/${params.id}/lesson/${prevSlug}`}
                className="px-5 py-2 rounded-lg border border-gold-500/20 text-gold-500 cursor-pointer"
              >
                Previous
              </Link>
            )}
            <Link
              href={`/dashboard/learn/course/${params.id}`}
              className="px-5 py-2 rounded-lg border border-gold-500/20 text-gold-500 cursor-pointer"
            >
              Back to Course
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
