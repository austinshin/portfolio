-- Migration: remove the 'food', 'read', and 'reading' sections.
-- Run this in the Supabase SQL editor.
--
-- WARNING: this deletes any existing posts in those sections. If you want to
-- keep some, move them to another section first, e.g.:
--   update public.posts set section = 'blog' where section = 'food';

delete from public.posts where section in ('food', 'read', 'reading');

-- Replace the allowed-sections constraint
alter table public.posts drop constraint if exists posts_section_check;
alter table public.posts
  add constraint posts_section_check
  check (section in ('blog', 'shows'));
