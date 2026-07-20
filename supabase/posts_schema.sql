-- Posts table for the markdown-driven content sections
-- (Blog, Notes, Read, Currently Reading, Food).
--
-- Run this in the Supabase SQL editor, then create your login user under
-- Authentication → Users (email + password). Anyone authenticated can write;
-- the public can only read published posts.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  section text not null check (section in ('blog', 'read', 'reading', 'food', 'shows')),
  content text not null default '',
  image_url text,
  author text,
  tags text, -- comma-separated
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section, slug)
);

alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts for select
  using (published = true);

drop policy if exists "Authenticated users can read all posts" on public.posts;
create policy "Authenticated users can read all posts"
  on public.posts for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert posts" on public.posts;
create policy "Authenticated users can insert posts"
  on public.posts for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update posts" on public.posts;
create policy "Authenticated users can update posts"
  on public.posts for update
  to authenticated
  using (true);

drop policy if exists "Authenticated users can delete posts" on public.posts;
create policy "Authenticated users can delete posts"
  on public.posts for delete
  to authenticated
  using (true);

-- Example seed data (uncomment to try it out):
-- insert into public.posts (title, slug, section, content) values
--   ('Hello world', 'hello-world', 'blog', '# Hello\n\nFirst post written in **markdown**.'),
--   ('Atomic Habits', 'atomic-habits', 'read', 'Great book on building systems instead of goals.'),
--   ('The Pragmatic Programmer', 'pragmatic-programmer', 'reading', 'Re-reading this classic.'),
--   ('Best ramen in SF', 'best-ramen-sf', 'food', 'A running list of my favorite ramen spots.');
