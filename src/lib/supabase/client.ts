import { createClient } from '@supabase/supabase-js';

// If NEXT_PUBLIC_SUPABASE_URL is not set, use a minimal mock supabase
// client so the UI can run without DB tables during local UI-focused development.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let supabaseClient: any = null;

if (url && anon) {
  supabaseClient = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // Minimal chainable query mock
  const createQuery = () => {
    const q: any = {
      select: (_cols?: any) => q,
      eq: (_k: any, _v: any) => q,
      order: async (_k: any, _opts?: any) => ({ data: [], error: null }),
      maybeSingle: async () => ({ data: null, error: null }),
      single: async () => ({ data: null, error: { message: 'not found' } }),
      upsert: async () => ({ data: null, error: null }),
      insert: async () => ({ data: null, error: null }),
    };
    return q;
  };

  const mockAuth = {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async (_creds: any) => ({ error: null }),
    signUp: async (_opts: any) => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    signInWithOAuth: async (_opts: any) => ({ error: null }),
    resend: async () => ({ error: null }),
  };

  const mockStorage = {
    from: (_bucket: string) => ({
      upload: async (_path: string, _file: any, _opts?: any) => ({ error: null }),
      getPublicUrl: (_path: string) => ({ data: { publicUrl: `/_mock/${_path}` } }),
    }),
  };

  supabaseClient = {
    from: (_table: string) => createQuery(),
    auth: mockAuth,
    storage: mockStorage,
  };
}

export const supabase = supabaseClient;
