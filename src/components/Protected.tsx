'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signin');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>;
  }
  if (!user) {
    return null;
  }
  return <>{children}</>;
}

