-- Migration: remove the 'shows' section.
-- Run this in the Supabase SQL editor.
--
-- WARNING: this deletes any existing shows posts. If you want to keep them,
-- move them to the blog first:
--   update public.posts set section = 'blog' where section = 'shows';

delete from public.posts where section = 'shows';

-- Replace the allowed-sections constraint
alter table public.posts drop constraint if exists posts_section_check;
alter table public.posts
  add constraint posts_section_check
  check (section in ('blog'));
