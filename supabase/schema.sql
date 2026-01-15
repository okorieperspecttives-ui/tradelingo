-- Courses and Lessons schema with RLS and storage buckets
-- Idempotent creation

-- Storage buckets
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'course-images') then
    insert into storage.buckets (id, name, public) values ('course-images', 'course-images', true);
  end if;
  if not exists (select 1 from storage.buckets where id = 'lesson-assets') then
    insert into storage.buckets (id, name, public) values ('lesson-assets', 'lesson-assets', true);
  end if;
end $$;

alter table storage.objects enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'objects_select_public_course_images') then
    create policy "objects_select_public_course_images" on storage.objects
      for select to public using (bucket_id = 'course-images');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'objects_insert_course_images_owner') then
    create policy "objects_insert_course_images_owner" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'course-images' and owner = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'objects_update_course_images_owner') then
    create policy "objects_update_course_images_owner" on storage.objects
      for update to authenticated
      using (bucket_id = 'course-images' and owner = auth.uid())
      with check (bucket_id = 'course-images' and owner = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'objects_delete_course_images_owner') then
    create policy "objects_delete_course_images_owner" on storage.objects
      for delete to authenticated
      using (bucket_id = 'course-images' and owner = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'objects_select_public_lesson_assets') then
    create policy "objects_select_public_lesson_assets" on storage.objects
      for select to public using (bucket_id = 'lesson-assets');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'objects_insert_lesson_assets_owner') then
    create policy "objects_insert_lesson_assets_owner" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'lesson-assets' and owner = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'objects_update_lesson_assets_owner') then
    create policy "objects_update_lesson_assets_owner" on storage.objects
      for update to authenticated
      using (bucket_id = 'lesson-assets' and owner = auth.uid())
      with check (bucket_id = 'lesson-assets' and owner = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'objects_delete_lesson_assets_owner') then
    create policy "objects_delete_lesson_assets_owner" on storage.objects
      for delete to authenticated
      using (bucket_id = 'lesson-assets' and owner = auth.uid());
  end if;
end $$;

-- Courses table
create table if not exists public.courses (
  id text primary key,
  title text not null,
  subtitle text,
  description text,
  xp_total integer default 0 not null,
  image_url text,
  published boolean default true not null,
  "order" integer default 1 not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.courses enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'courses' and policyname = 'courses_select_all') then
    create policy "courses_select_all" on public.courses
      for select
      to public
      using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'courses' and policyname = 'courses_insert_owner_teacher') then
    create policy "courses_insert_owner_teacher" on public.courses
      for insert
      to authenticated
      with check (
        owner_id = auth.uid()
        and exists (
          select 1 from public.profiles p where p.id = auth.uid() and lower(coalesce(p.role, '')) = 'teacher'
        )
      );
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'courses' and policyname = 'courses_update_owner') then
    create policy "courses_update_owner" on public.courses
      for update
      to authenticated
      using (owner_id = auth.uid())
      with check (owner_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'courses' and policyname = 'courses_delete_owner') then
    create policy "courses_delete_owner" on public.courses
      for delete
      to authenticated
      using (owner_id = auth.uid());
  end if;
end $$;

-- Lessons table
create table if not exists public.lessons (
  id bigserial primary key,
  slug text not null,
  title text not null,
  course_id text not null references public.courses(id) on delete cascade,
  "order" integer default 1 not null,
  content_html text,
  quiz_json jsonb,
  xp integer default 0 not null,
  published boolean default true not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (course_id, slug)
);

alter table public.lessons enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'lessons' and policyname = 'lessons_select_all') then
    create policy "lessons_select_all" on public.lessons
      for select
      to public
      using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'lessons' and policyname = 'lessons_insert_course_owner_teacher') then
    create policy "lessons_insert_course_owner_teacher" on public.lessons
      for insert
      to authenticated
      with check (
        exists (
          select 1 from public.courses c
          where c.id = lessons.course_id
            and c.owner_id = auth.uid()
        )
        and exists (
          select 1 from public.profiles p where p.id = auth.uid() and lower(coalesce(p.role, '')) = 'teacher'
        )
      );
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'lessons' and policyname = 'lessons_update_course_owner') then
    create policy "lessons_update_course_owner" on public.lessons
      for update
      to authenticated
      using (
        exists (
          select 1 from public.courses c
          where c.id = lessons.course_id
            and c.owner_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1 from public.courses c
          where c.id = lessons.course_id
            and c.owner_id = auth.uid()
        )
      );
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'lessons' and policyname = 'lessons_delete_course_owner') then
    create policy "lessons_delete_course_owner" on public.lessons
      for delete
      to authenticated
      using (
        exists (
          select 1 from public.courses c
          where c.id = lessons.course_id
            and c.owner_id = auth.uid()
        )
      );
  end if;
end $$;
