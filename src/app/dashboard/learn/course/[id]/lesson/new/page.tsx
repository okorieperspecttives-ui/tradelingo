'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type ProfileRow = {
  id: string;
  role: string | null;
};

export default function NewLessonPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [xp, setXp] = useState<number>(25);
  const [published, setPublished] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  const editorRef = useRef<HTMLDivElement | null>(null);

  const [questions, setQuestions] = useState<
    { prompt: string; options: { text: string; correct: boolean }[] }[]
  >([]);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('profiles').select('id,role').eq('id', user.id).single();
      if (!active) return;
      if (error) {
        setProfile({ id: user.id, role: null });
      } else {
        setProfile(data as ProfileRow);
      }
      setLoading(false);
    }
    loadProfile();
    return () => {
      active = false;
    };
  }, [user]);

  const isTeacher = useMemo(() => (profile?.role ?? '').toLowerCase() === 'teacher', [profile]);

  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80);
  }

  function handleTitleChange(v: string) {
    setTitle(v);
    setSlug(slugify(v));
  }

  function insertAtCaret(html: string) {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      el.innerHTML += html;
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node;
    while ((node = temp.firstChild)) {
      frag.appendChild(node);
    }
    range.insertNode(frag);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  async function handleImageUpload(file: File | null) {
    if (!file || !user) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const res = await supabase.storage.from('lesson-assets').upload(path, file, { upsert: true });
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    const pub = supabase.storage.from('lesson-assets').getPublicUrl(path);
    const url = pub.data.publicUrl;
    insertAtCaret(`<img src="${url}" alt="" style="max-width:100%;border-radius:0.5rem;border:1px solid rgba(212,175,55,0.2);margin:0.5rem 0;" />`);
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, { prompt: '', options: [{ text: '', correct: true }, { text: '', correct: false }] }]);
  }
  function updateQuestion(i: number, v: { prompt?: string; options?: { text: string; correct: boolean }[] }) {
    setQuestions((qs) => {
      const copy = [...qs];
      copy[i] = { prompt: v.prompt ?? copy[i].prompt, options: v.options ?? copy[i].options };
      return copy;
    });
  }
  function addOption(i: number) {
    setQuestions((qs) => {
      const copy = [...qs];
      copy[i] = { ...copy[i], options: [...copy[i].options, { text: '', correct: false }] };
      return copy;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error('Sign in required');
      return;
    }
    if (!isTeacher) {
      toast.error('You do not have permission to add lessons');
      return;
    }
    if (!title || !slug) {
      toast.error('Title is required');
      return;
    }
    setSubmitting(true);
    try {
      const content_html = editorRef.current?.innerHTML ?? '';
      const quiz_json = { questions };
      const insertRes = await supabase
        .from('lessons')
        .upsert(
          {
            slug,
            title,
            course_id: params.id,
            order,
            content_html,
            quiz_json,
            xp,
            published,
          },
          { onConflict: 'course_id,slug', ignoreDuplicates: false }
        )
        .select('slug')
        .single();
      if (insertRes.error) throw insertRes.error;
      toast.success('Lesson created');
      router.replace(`/dashboard/learn/course/${params.id}/lesson/${slug}`);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to create lesson');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading…</div>;
  }
  if (!user) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Add Lesson</h1>
          <p className="text-gray-400 mt-2">Sign in as a teacher to add lessons.</p>
        </div>
      </div>
    );
  }
  if (!isTeacher) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Access Denied</h1>
          <p className="text-gray-400 mt-2">Only course owners can add lessons.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-gold-500">Add Lesson</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                placeholder="e.g., What is a Pip?"
                required
              />
              <label className="block text-sm text-gray-400 mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                placeholder="auto-generated from title"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm text-gray-400 mb-1">Order</label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
              />
              <label className="block text-sm text-gray-400 mb-1">XP</label>
              <input
                type="number"
                min={0}
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
              />
              <div className="flex items-center gap-2">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-gold-500 focus:ring-gold-500"
                />
                <label htmlFor="published" className="text-gray-300">Publish</label>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 space-y-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded-md border border-gold-500/20 text-gold-500 cursor-pointer"
              onClick={() => insertAtCaret('<h2 style=\"font-size:1.25rem;color:#d4af37;margin:0.5rem 0;\">Heading</h2>')}
            >
              H2
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded-md border border-gold-500/20 text-gold-500 cursor-pointer"
              onClick={() => insertAtCaret('<p style=\"margin:0.5rem 0;\">Paragraph</p>')}
            >
              Paragraph
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded-md border border-gold-500/20 text-gold-500 cursor-pointer"
              onClick={() => insertAtCaret('🔥')}
            >
              Emoji
            </button>
            <label className="px-3 py-2 rounded-md border border-gold-500/20 text-gold-500 cursor-pointer">
              <span>Insert Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <div
            ref={editorRef}
            className="min-h-[200px] px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none"
            contentEditable
            suppressContentEditableWarning
          />
        </div>
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif text-gold-500">Quiz Builder</h3>
            <button
              type="button"
              className="px-3 py-2 rounded-md bg-gold-500 text-black cursor-pointer"
              onClick={addQuestion}
            >
              Add Question
            </button>
          </div>
          <div className="space-y-6">
            {questions.map((q, qi) => (
              <div key={qi} className="space-y-3">
                <input
                  type="text"
                  value={q.prompt}
                  onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
                  placeholder="Question prompt"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                />
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const ops = q.options.slice();
                          ops[oi] = { ...ops[oi], text: e.target.value };
                          updateQuestion(qi, { options: ops });
                        }}
                        placeholder={`Option ${oi + 1}`}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                      />
                      <label className="flex items-center gap-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={opt.correct}
                          onChange={(e) => {
                            const ops = q.options.slice();
                            ops[oi] = { ...ops[oi], correct: e.target.checked };
                            updateQuestion(qi, { options: ops });
                          }}
                        />
                        Correct
                      </label>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-gold-500/20 text-gold-500 cursor-pointer"
                    onClick={() => addOption(qi)}
                  >
                    Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gold-500/20 text-gold-500 cursor-pointer"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Creating…' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
}
