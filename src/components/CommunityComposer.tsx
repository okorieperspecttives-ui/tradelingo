"use client";

import { useState } from 'react';

export default function CommunityComposer({ onPost }: { onPost?: (p: any) => void }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handlePost() {
    if (!text.trim()) return;
    setSubmitting(true);
    const post = {
      id: `p_${Date.now()}`,
      author: 'You',
      avatar: null,
      content: text.trim(),
      votes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
    };
    // simulate latency
    await new Promise((r) => setTimeout(r, 250));
    onPost?.(post);
    setText('');
    setSubmitting(false);
  }

  return (
    <div className="bg-dark-card border border-gold-500/10 rounded-xl p-4">
      <h3 className="font-medium text-gold-500">Share an idea</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="mt-3 w-full px-3 py-2 rounded bg-gray-900 border border-gray-800 text-white focus:outline-none"
        placeholder="Share a trade idea, chart, or question..."
      />
      <div className="mt-3 flex items-center gap-2">
        <button className="px-3 py-2 rounded border border-gold-500/20 text-gold-500">Attach</button>
        <button className="px-3 py-2 rounded border border-gold-500/20 text-gold-500">Tag</button>
        <div className="ml-auto">
          <button onClick={handlePost} disabled={submitting} className="px-4 py-2 rounded bg-gold-500 text-black font-semibold">
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
