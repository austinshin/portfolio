-- Migration: add 'shows' section, remove 'notes' (existing notes become blog posts).
-- Run this in the Supabase SQL editor.

-- Any existing notes move to the blog
update public.posts set section = 'blog' where section = 'notes';

-- Replace the allowed-sections constraint
alter table public.posts drop constraint if exists posts_section_check;
alter table public.posts
  add constraint posts_section_check
  check (section in ('blog', 'read', 'reading', 'food', 'shows'));
