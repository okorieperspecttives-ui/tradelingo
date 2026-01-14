'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'react-toastify';
import Link from 'next/link';

const options = [
  { id: 'a', text: 'EUR/USD shows how many USD for one EUR' },
  { id: 'b', text: 'Pairs are two stocks combined' },
  { id: 'c', text: 'Pairs mean two brokers sharing an account' },
  { id: 'd', text: 'Pairs are a chart timeframe' },
];
const correctId = 'a';

export default function LessonCurrencyPairsPage() {
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
      const metaLessonId = 1001; // placeholder local id

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
      toast.success(isCorrect ? 'Great! That’s correct.' : 'Close! Review and try again.');
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message ?? 'Could not record progress.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
        <h1 className="font-serif text-2xl text-gold-500">Currency Pairs</h1>
        <p className="text-gray-400 mt-2">
          Currency pairs show the value of one currency relative to another. EUR/USD tells you how many US dollars
          one euro is worth. The first currency is the base; the second is the quote.
        </p>
      </div>

      <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 space-y-4">
        <p className="text-gray-300">Which statement about EUR/USD is correct?</p>
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
            <Link href="/dashboard/learn" className="px-5 py-2 rounded-lg bg-blue-500 text-black font-semibold hover:opacity-90 transition cursor-pointer">
              Next (Back to Units)
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
