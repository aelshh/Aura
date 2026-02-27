-- Dopamine Detox Tracker — Supabase Schema
-- Run this in your Supabase SQL editor

create table if not exists detox_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  start_timestamp timestamptz not null default now(),
  avoided_items jsonb not null default '[]'::jsonb,
  total_aura numeric not null default 0,
  streak_days integer not null default 0,
  last_active timestamptz not null default now(),
  relapse_timestamp timestamptz,
  is_active boolean not null default true,
  claimed_milestones jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table detox_sessions enable row level security;

create policy "Users can only access own sessions"
  on detox_sessions
  for all
  using (user_id = auth.uid());

-- Index for fast user lookups
create index if not exists detox_sessions_user_id_idx on detox_sessions(user_id);
create index if not exists detox_sessions_active_idx on detox_sessions(user_id, is_active);
