"use client";

import { useState } from 'react';
import PostCard from './PostCard';

export default function CommunityFeed({ initial = [] as any[] } ) {
  const [posts, setPosts] = useState<any[]>([
    ...(initial.length ? initial : [
      { id: 'p1', author: 'Alex', content: 'Bullish on EUR after the breakout. Watching 1.1000.', votes: 12, comments: 3, created_at: new Date(Date.now()-3600_000).toISOString() },
      { id: 'p2', author: 'Sam', content: 'Risk management tip: size to 1% of account.', votes: 8, comments: 1, created_at: new Date(Date.now()-7200_000).toISOString() },
    ])
  ]);

  function addPost(p: any) {
    setPosts((s) => [p, ...s]);
  }

  function handleVote(id: string, delta: number) {
    setPosts((s) => s.map((p) => (p.id === id ? { ...p, votes: (p.votes ?? 0) + delta } : p)));
  }

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} onVote={handleVote} />
      ))}
    </div>
  );
}
