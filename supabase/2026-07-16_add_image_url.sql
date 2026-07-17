-- Migration: optional image on posts (book covers, show posters, etc.)
-- Run this in the Supabase SQL editor.

alter table public.posts add column if not exists image_url text;
