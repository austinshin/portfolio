create extension if not exists pgcrypto;

create table if not exists public.tcg_instagram_handles (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  last_checked_at timestamp with time zone,
  last_post_at timestamp with time zone
);

create table if not exists public.tcg_instagram_posts (
  id uuid primary key default gen_random_uuid(),
  handle_id uuid references public.tcg_instagram_handles(id) on delete set null,
  handle text not null,
  external_post_id text not null unique,
  permalink text not null,
  caption text,
  media_type text,
  thumbnail_url text,
  posted_at timestamp with time zone not null,
  raw_json jsonb,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

create index if not exists idx_tcg_handles_is_active
  on public.tcg_instagram_handles (is_active);

create index if not exists idx_tcg_posts_posted_at
  on public.tcg_instagram_posts (posted_at desc);

create index if not exists idx_tcg_posts_handle_posted_at
  on public.tcg_instagram_posts (handle, posted_at desc);

alter table public.tcg_instagram_handles enable row level security;
alter table public.tcg_instagram_posts enable row level security;
