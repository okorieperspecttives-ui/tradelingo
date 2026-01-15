"use client";

import { useState } from 'react';

export default function PostCard({ post, onVote }: { post: any; onVote?: (id: string, delta: number) => void }) {
  const [votes, setVotes] = useState(post.votes ?? 0);

  function vote(delta: number) {
    setVotes((v) => v + delta);
    onVote?.(post.id, delta);
  }

  return (
    <div className="bg-dark-card border border-gold-500/10 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-black font-bold">{(post.author || 'U')[0]}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">{post.author}</div>
              <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</div>
            </div>
            <div className="text-sm text-gray-400">{votes} votes · {post.comments ?? 0} comments</div>
          </div>

          <p className="mt-3 text-gray-200">{post.content}</p>

          <div className="mt-3 flex items-center gap-2">
            <button onClick={() => vote(1)} className="px-3 py-1 rounded border border-gold-500/20 text-gold-500">▲ Up</button>
            <button onClick={() => vote(-1)} className="px-3 py-1 rounded border border-gold-500/20 text-gold-500">▼ Down</button>
            <button className="px-3 py-1 rounded border border-gold-500/20 text-gold-500">Comment</button>
            <button className="ml-auto px-3 py-1 rounded border border-gold-500/20 text-gold-500">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}
