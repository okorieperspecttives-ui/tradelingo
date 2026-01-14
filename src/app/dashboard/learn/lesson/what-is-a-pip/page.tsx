'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'react-toastify';
import Link from 'next/link';

const options = [
  { id: 'a', text: 'A unit measuring price movement in forex pairs' },
  { id: 'b', text: 'A kind of fruit' },
  { id: 'c', text: 'A stock exchange' },
  { id: 'd', text: 'A brokerage account type' },
];
const correctId = 'a';

export default function LessonPipPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selected === correctId;

  async function submit() {
    setSubmitting(true);
    try {
      const total = 1;
      const correct = isCorrect ? 1 : 0;
      const metaLessonId = 1000; // placeholder local id

      if (user) {
        await supabase.from('quiz_attempts').insert({
          user_id: user.id,
          lesson_id: metaLessonId,
          correct_count: correct,
          total_count: total,
        });
        await supabase
          .from('user_progress')
          .upsert({ user_id: user.id, lesson_id: metaLessonId, status: 'completed' }, { onConflict: 'user_id,lesson_id', ignoreDuplicates: true });
      }
      toast.success(isCorrect ? 'Nice! You got it right.' : 'Good try! Review and keep going.');
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message ?? 'Could not record progress. You can still continue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
        <h1 className="font-serif text-2xl text-gold-500">What is a Pip?</h1>
        <p className="text-gray-400 mt-2">
          A “pip” is the standard unit to measure price changes in forex pairs. Think of it like a single
          step on a ladder—each step is a small move. For most major pairs, 1 pip is 0.0001.
        </p>
      </div>

      <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 space-y-4">
        <p className="text-gray-300">Which statement best describes a pip?</p>
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              className={`w-full text-left px-4 py-3 rounded-lg border transition cursor-pointer ${
                selected === opt.id ? 'border-gold-500 text-gold-500 bg-gold-500/10' : 'border-gray-800 text-gray-300 hover:border-gold-500/30'
              }`}
              onClick={() => setSelected(opt.id)}
            >
              {opt.text}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-5 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
            disabled={!selected || submitting}
            onClick={submit}
            type="button"
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
          {submitted && isCorrect && (
            <Link href="/dashboard/learn/lesson/currency-pairs" className="px-5 py-2 rounded-lg bg-blue-500 text-black font-semibold hover:opacity-90 transition cursor-pointer">
              Next Lesson
            </Link>
          )}
          {submitted && !isCorrect && (
            <button
              className="px-5 py-2 rounded-lg border border-gold-500/20 text-gold-500 cursor-pointer"
              type="button"
              onClick={() => {
                setSubmitted(false);
                setSelected(null);
              }}
            >
              Try Again
            </button>
          )}
          <Link href="/dashboard/learn" className="px-5 py-2 rounded-lg border border-gold-500/20 text-gold-500 cursor-pointer">
            Back to Units
          </Link>
        </div>
      </div>
    </div>
  );
}
