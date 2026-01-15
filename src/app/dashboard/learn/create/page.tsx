'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import Protected from '@/components/Protected';
import { toast } from 'react-toastify';
import Link from 'next/link';

type QuizOption = { text: string };
type QuizItem = { question: string; options: QuizOption[]; correctIndex: number };

export default function CreateLessonPage() {
  const { user } = useAuth();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [quizCount, setQuizCount] = useState<5 | 10>(5);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([
    { question: '', options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctIndex: 0 },
    { question: '', options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctIndex: 0 },
    { question: '', options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctIndex: 0 },
    { question: '', options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctIndex: 0 },
    { question: '', options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctIndex: 0 },
  ]);
  const [action, setAction] = useState<'link' | 'image' | 'video' | 'emoji' | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    const desired = quizCount === 5 ? 5 : 10;
    if (quizzes.length < desired) {
      setQuizzes((q) => q.concat(Array.from({ length: desired - q.length }, () => ({ question: '', options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctIndex: 0 }))));
    } else if (quizzes.length > desired) {
      setQuizzes((q) => q.slice(0, desired));
    }
  }, [quizCount]);

  function exec(cmd: string, value?: string) {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) editorRef.current.focus();
    document.execCommand(cmd, false, value);
    setContentHtml(editorRef.current.innerHTML);
  }
  function insertHtml(html: string) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertHTML', false, html);
    setContentHtml(editorRef.current.innerHTML);
  }

  function handleInsert() {
    if (!action) return;
    const value = input.trim();
    if (!value) {
      toast.error('Enter a value');
      return;
    }
    editorRef.current?.focus();
    if (action === 'link') {
      exec('createLink', value);
    } else if (action === 'image') {
      insertHtml(`<img src="${value}" alt="" style="max-width:100%;border-radius:8px;margin:8px 0;" />`);
    } else if (action === 'video') {
      if (value.includes('youtube.com') || value.includes('youtu.be')) {
        insertHtml(`<iframe src="${value}" style="width:100%;height:360px;border-radius:8px;margin:8px 0;" allowfullscreen></iframe>`);
      } else {
        insertHtml(`<video src="${value}" controls style="width:100%;border-radius:8px;margin:8px 0;"></video>`);
      }
    } else if (action === 'emoji') {
      insertHtml(value);
    }
    setAction(null);
    setInput('');
  }

  function setQuizField(i: number, k: number, text: string) {
    setQuizzes((qs) => {
      const copy = qs.slice();
      const q = { ...copy[i] };
      if (k === -1) {
        q.question = text;
      } else {
        const opts = q.options.slice();
        opts[k] = { text };
        q.options = opts;
      }
      copy[i] = q;
      return copy;
    });
  }
  function setCorrect(i: number, idx: number) {
    setQuizzes((qs) => {
      const copy = qs.slice();
      copy[i] = { ...copy[i], correctIndex: idx };
      return copy;
    });
  }

  function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  async function save() {
    if (!user) {
      toast.error('Sign in to create lessons');
      return;
    }
    if (!title.trim()) {
      toast.error('Add a lesson title');
      return;
    }
    const slug = slugify(title);
    const xp = quizCount === 5 ? 50 : 100;
    try {
      const { error: err1 } = await supabase.from('lessons').upsert(
        { slug, title, course_id: 'forex-foundations', content_html: contentHtml, order: 999, xp },
        { onConflict: 'slug', ignoreDuplicates: false }
      );
      if (err1) throw err1;
      const { error: err2 } = await supabase.from('lesson_quizzes').upsert(
        { lesson_slug: slug, quizzes: quizzes.map((q) => ({ question: q.question, options: q.options.map((o) => o.text), correctIndex: q.correctIndex })) },
        { onConflict: 'lesson_slug', ignoreDuplicates: false }
      );
      if (err2) throw err2;
      toast.success('Lesson saved');
    } catch (e: any) {
      window.localStorage.setItem(`lesson:${slug}`, JSON.stringify({ title, contentHtml, quizzes, xp }));
      toast.info('Saved locally (Supabase unavailable).');
    }
  }

  return (
    <Protected>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl text-gold-500">Create Lesson</h1>
          <Link href="/dashboard/learn" className="px-4 py-2 rounded-lg border border-gold-500/20 text-gold-500 cursor-pointer">Back</Link>
        </div>

        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 space-y-4">
          <label className="block text-sm text-gray-400">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
            placeholder="Lesson title"
          />
        </div>

        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 rounded-md border border-gold-500/20 text-gold-500 cursor-pointer" onClick={() => exec('bold')} type="button">Bold</button>
            <button className="px-3 py-2 rounded-md border border-gold-500/20 text-gold-500 cursor-pointer" onClick={() => exec('italic')} type="button">Italic</button>
            <button className={`px-3 py-2 rounded-md border border-gold-500/20 ${action === 'link' ? 'bg-gold-500 text-black' : 'text-gold-500'} cursor-pointer`} onClick={() => setAction('link')} type="button">Link</button>
            <button className={`px-3 py-2 rounded-md border border-gold-500/20 ${action === 'image' ? 'bg-gold-500 text-black' : 'text-gold-500'} cursor-pointer`} onClick={() => setAction('image')} type="button">Image</button>
            <button className={`px-3 py-2 rounded-md border border-gold-500/20 ${action === 'video' ? 'bg-gold-500 text-black' : 'text-gold-500'} cursor-pointer`} onClick={() => setAction('video')} type="button">Video</button>
            <button className={`px-3 py-2 rounded-md border border-gold-500/20 ${action === 'emoji' ? 'bg-gold-500 text-black' : 'text-gold-500'} cursor-pointer`} onClick={() => setAction('emoji')} type="button">Emoji</button>
          </div>
          {action && (
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  action === 'link'
                    ? 'https://example.com'
                    : action === 'image'
                    ? 'Image URL'
                    : action === 'video'
                    ? 'Video URL or embed'
                    : 'Emoji'
                }
                className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
              />
              <button className="px-3 py-2 rounded-md border border-gold-500/20 text-gold-500 cursor-pointer" onClick={handleInsert} type="button">Insert</button>
              <button className="px-3 py-2 rounded-md border border-gold-500/20 text-gold-500 cursor-pointer" onClick={() => { setAction(null); setInput(''); }} type="button">Cancel</button>
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            className="min-h-48 w-full px-3 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none"
            onInput={() => setContentHtml(editorRef.current?.innerHTML ?? '')}
          />
        </div>

        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Quiz count</label>
            <button className={`px-3 py-2 rounded-md border border-gold-500/20 ${quizCount === 5 ? 'bg-gold-500 text-black' : 'text-gold-500'} cursor-pointer`} onClick={() => setQuizCount(5)} type="button">5</button>
            <button className={`px-3 py-2 rounded-md border border-gold-500/20 ${quizCount === 10 ? 'bg-gold-500 text-black' : 'text-gold-500'} cursor-pointer`} onClick={() => setQuizCount(10)} type="button">10</button>
            <span className="ml-auto text-sm text-gray-400">XP: {quizCount === 5 ? 50 : 100}</span>
          </div>
          <div className="space-y-6">
            {quizzes.map((q, i) => (
              <div key={i} className="border border-gold-500/10 rounded-lg p-4 space-y-3 bg-dark-card">
                <div>
                  <label className="block text-xs text-gray-400">Question {i + 1}</label>
                  <input
                    value={q.question}
                    onChange={(e) => setQuizField(i, -1, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                    placeholder="Enter question text"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt, k) => (
                    <div key={k} className="flex items-center gap-2">
                      <input
                        value={opt.text}
                        onChange={(e) => setQuizField(i, k, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                        placeholder={`Option ${k + 1}`}
                      />
                      <input
                        type="radio"
                        checked={q.correctIndex === k}
                        onChange={() => setCorrect(i, k)}
                        className="cursor-pointer"
                      />
                      <span className="text-xs text-gray-400">Correct</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition cursor-pointer" onClick={save} type="button">Save Lesson</button>
          <span className="text-gray-400 text-sm">Saved content appears under course if tables exist</span>
        </div>
      </div>
    </Protected>
  );
}
