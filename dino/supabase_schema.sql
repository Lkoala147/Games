-- Dino Runner online leaderboard schema
-- Run this in Supabase SQL Editor

create table if not exists public.dino_leaderboard (
  player_name text primary key,
  best_score integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_dino_leaderboard_updated_at on public.dino_leaderboard;
create trigger trg_dino_leaderboard_updated_at
before update on public.dino_leaderboard
for each row
execute function public.set_updated_at();

alter table public.dino_leaderboard enable row level security;

drop policy if exists "read leaderboard anon" on public.dino_leaderboard;
create policy "read leaderboard anon"
on public.dino_leaderboard
for select
to anon
using (true);

drop policy if exists "insert leaderboard anon" on public.dino_leaderboard;
create policy "insert leaderboard anon"
on public.dino_leaderboard
for insert
to anon
with check (char_length(player_name) > 0 and char_length(player_name) <= 18 and best_score >= 0);

drop policy if exists "update leaderboard anon" on public.dino_leaderboard;
create policy "update leaderboard anon"
on public.dino_leaderboard
for update
to anon
using (true)
with check (char_length(player_name) > 0 and char_length(player_name) <= 18 and best_score >= 0);
