-- Migration: author + genre/topic tags on posts (books, shows, etc.)
-- Run this in the Supabase SQL editor.

alter table public.posts add column if not exists author text;
alter table public.posts add column if not exists tags text; -- comma-separated
