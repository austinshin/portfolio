-- Migration: remove the 'blog' section — the last posts section.
-- Run this in the Supabase SQL editor.
--
-- WARNING: this drops the posts table and deletes ALL post data. If you want
-- to keep the content, export it first:
--   select * from public.posts;

drop table if exists public.posts;
