'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-toastify';

export default function VerifyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      // If a session exists after verification, go to dashboard
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  async function resend() {
    if (!email) {
      toast.error('Enter your email to resend verification');
      return;
    }
    setResending(true);
    try {
      const redirect = typeof window !== 'undefined' ? `${window.location.origin}/verify` : undefined;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: redirect },
      } as any);
      if (error) throw error;
      toast.success('Verification email resent');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="w-full max-w-md bg-dark-card border border-gold-500/10 p-6 rounded-xl">
        <h1 className="font-serif text-2xl text-gold-500 mb-2">Verify Your Email</h1>
        <p className="text-gray-400 mb-4">
          We sent a verification link to your email. Please click it to activate your account.
          This page will redirect once verification completes.
        </p>
        <div className="space-y-3">
          <label className="block text-sm text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
          />
          <button
            className="w-full px-4 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-60"
            disabled={resending}
            onClick={resend}
            type="button"
          >
            {resending ? 'Resending…' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    </main>
  );
}
