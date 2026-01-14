'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-toastify';

export default function SignInPage() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Signed in successfully');
      } else {
        await signUp(email, password);
        toast.success('Account created. Please verify your email.');
        router.replace('/verify');
        return;
      }
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message ?? (mode === 'signin' ? 'Sign in failed' : 'Sign up failed'));
      toast.error(err.message ?? 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined },
    });
    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else {
      toast.info('Redirecting to Google…');
    }
  }

  
  return (
    <main className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="w-full max-w-md bg-dark-card border border-gold-500/10 p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <button
            className={`px-3 py-2 rounded-md border border-gold-500/20 ${mode === 'signin' ? 'bg-gold-500 text-black' : 'text-gold-500'} cursor-pointer`}
            onClick={() => setMode('signin')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`px-3 py-2 rounded-md border border-gold-500/20 ${mode === 'signup' ? 'bg-gold-500 text-black' : 'text-gold-500'} cursor-pointer`}
            onClick={() => setMode('signup')}
            type="button"
          >
            Sign Up
          </button>
        </div>
        <h1 className="font-serif text-2xl text-gold-500 mb-4">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-gold-500 text-black font-semibold hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? (mode === 'signin' ? 'Signing in…' : 'Signing up…') : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogle}
            type="button"
            className="w-full px-4 py-2 rounded-lg border border-gold-500/20 text-gold-500 hover:bg-gold-500/10 transition cursor-pointer"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </main>
  );
}
