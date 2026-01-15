'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type ProfileRow = {
  id: string;
  role: string | null;
};

export default function NewCoursePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpTotal, setXpTotal] = useState<number>(100);
  const [order, setOrder] = useState<number>(1);
  const [published, setPublished] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('id,role')
        .eq('id', user.id)
        .single();
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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error('Sign in required');
      return;
    }
    if (!isTeacher) {
      toast.error('You do not have permission to create courses');
      return;
    }
    if (!title || !description) {
      toast.error('Title and description are required');
      return;
    }
    setSubmitting(true);
    try {
      const id = slugify(title);
      let image_url: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${user.id}/${Date.now()}-${id}.${ext}`;
        const uploadRes = await supabase.storage.from('course-images').upload(path, imageFile, { upsert: true });
        if (uploadRes.error) {
          toast.error(uploadRes.error.message);
        } else {
          const pub = supabase.storage.from('course-images').getPublicUrl(path);
          image_url = pub.data.publicUrl ?? null;
        }
      }

      const insertRes = await supabase
        .from('courses')
        .upsert(
          {
            id,
            title,
            subtitle,
            description,
            xp_total: xpTotal,
            image_url,
            published,
            order,
            owner_id: user.id,
          },
          { onConflict: 'id', ignoreDuplicates: false }
        )
        .select('id')
        .single();

      if (insertRes.error) {
        throw insertRes.error;
      }

      toast.success('Course created');
      router.replace(`/dashboard/learn/course/${id}`);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to create course');
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
          <h1 className="font-serif text-3xl text-gold-500">Create Course</h1>
          <p className="text-gray-400 mt-2">Sign in as a teacher to create courses.</p>
        </div>
      </div>
    );
  }
  if (!isTeacher) {
    return (
      <div className="space-y-8">
        <div className="bg-dark-card border border-gold-500/10 p-6 rounded-xl">
          <h1 className="font-serif text-3xl text-gold-500">Access Denied</h1>
          <p className="text-gray-400 mt-2">Only teachers can create courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-gold-500">Create Course</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="bg-dark-card p-6 rounded-xl border border-gold-500/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="aspect-[4/3] rounded-xl border border-gold-500/20 bg-gray-900 overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-500">Course Image</div>
                )}
              </div>
              <label className="mt-3 block">
                <span className="text-sm text-gray-400 mb-1 block">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-gray-300 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gold-500 file:text-black hover:file:opacity-90 cursor-pointer"
                />
              </label>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Forex Foundations"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A concise course tagline"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Describe the course outcomes, who it's for, and the structure."
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expected XP</label>
                  <input
                    type="number"
                    min={0}
                    value={xpTotal}
                    onChange={(e) => setXpTotal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Order</label>
                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    id="published"
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-gold-500 focus:ring-gold-500"
                  />
                  <label htmlFor="published" className="text-gray-300">Publish now</label>
                </div>
              </div>
            </div>
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
            {submitting ? 'Creating…' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
