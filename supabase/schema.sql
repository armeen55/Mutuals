-- MUTUALS schema for Supabase. Run this in the Supabase SQL editor.
-- No user auth: participants identify by display name only (anon access).
-- NOTE: policies below are permissive for a hackathon demo. Tighten before production.

create table if not exists groups (
  id text primary key,
  mode text not null default 'group',          -- 'duo' (1:1) | 'group' (3+)
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  group_id text not null references groups (id) on delete cascade,
  display_name text not null,
  completed boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (group_id, display_name)
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  group_id text not null references groups (id) on delete cascade,
  participant_id uuid not null references participants (id) on delete cascade,
  question_id text not null,
  option_index int not null,
  unique (group_id, participant_id, question_id)
);

create table if not exists guesses (
  id uuid primary key default gen_random_uuid(),
  group_id text not null references groups (id) on delete cascade,
  guesser_id uuid not null references participants (id) on delete cascade,
  target_id text not null,                      -- participant id (or seed name in demo data)
  question_id text not null,
  option_index int not null,
  unique (group_id, guesser_id, target_id, question_id)
);

create index if not exists participants_group_idx on participants (group_id);
create index if not exists answers_group_idx on answers (group_id);
create index if not exists guesses_group_idx on guesses (group_id);

-- Anon (no-login) access for the demo.
alter table groups enable row level security;
alter table participants enable row level security;
alter table answers enable row level security;
alter table guesses enable row level security;

create policy "demo all groups" on groups for all using (true) with check (true);
create policy "demo all participants" on participants for all using (true) with check (true);
create policy "demo all answers" on answers for all using (true) with check (true);
create policy "demo all guesses" on guesses for all using (true) with check (true);
