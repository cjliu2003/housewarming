-- ══════════════════════════════════════════════════════════════
--  Run this once in the Supabase SQL Editor
--  (Dashboard → SQL Editor → New query → paste → Run)
-- ══════════════════════════════════════════════════════════════

-- 1. Table that holds the single live game state
create table if not exists public.jeopardy_state (
  id          text        primary key default 'game',
  scores      jsonb       not null    default '{}',
  used_cells  text[]      not null    default '{}',
  teams       text[]      not null    default '{}',
  history     jsonb       not null    default '[]',
  updated_at  timestamptz not null    default now()
);

-- 2. Seed the single row so upserts always find it
insert into public.jeopardy_state (id)
values ('game')
on conflict (id) do nothing;

-- 3. Enable Row-Level Security (required for realtime)
alter table public.jeopardy_state enable row level security;

-- 4. Allow anyone with the anon key to read & write
--    (tighten this once you have auth set up)
create policy "public read"  on public.jeopardy_state for select using (true);
create policy "public write" on public.jeopardy_state for all    using (true);

-- 5. Turn on realtime for this table
--    (Dashboard → Database → Replication is the GUI alternative)
alter publication supabase_realtime add table public.jeopardy_state;

-- ── V2: teams & history columns (safe to re-run on an existing table) ──
alter table public.jeopardy_state
  add column if not exists teams   text[] not null default '{}',
  add column if not exists history jsonb  not null default '[]';
