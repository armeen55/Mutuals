-- MUTUALS schema for Supabase. Run this in the Supabase SQL editor for a fresh DB.
-- No user auth: participants identify by a per-room client_id (anon access).
-- RLS is anon select/insert/update only — anon CANNOT delete (see policies).

create table if not exists groups (
  id text primary key,
  mode text not null default 'group',          -- 'duo' (1:1) | 'group' (3+)
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  group_id text not null references groups (id) on delete cascade,
  display_name text not null,                   -- not unique: duplicate names allowed
  client_id text,                               -- per-room browser identity
  completed boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (group_id, client_id)
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

-- Insert-only event log (no anon select).
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  group_id text,
  participant_id uuid,
  props jsonb,
  created_at timestamptz not null default now()
);

create index if not exists participants_group_idx on participants (group_id);
create index if not exists answers_group_idx on answers (group_id);
create index if not exists guesses_group_idx on guesses (group_id);
create index if not exists events_group_idx on events (group_id);

alter table groups enable row level security;
alter table participants enable row level security;
alter table answers enable row level security;
alter table guesses enable row level security;
alter table events enable row level security;

-- Anon (no-login) access: read/create/update only. No delete policy => no anon delete.
create policy "anon read groups" on groups for select using (true);
create policy "anon add groups" on groups for insert with check (true);
create policy "anon edit groups" on groups for update using (true) with check (true);

create policy "anon read participants" on participants for select using (true);
create policy "anon add participants" on participants for insert with check (true);
create policy "anon edit participants" on participants for update using (true) with check (true);

create policy "anon read answers" on answers for select using (true);
create policy "anon add answers" on answers for insert with check (true);
create policy "anon edit answers" on answers for update using (true) with check (true);

create policy "anon read guesses" on guesses for select using (true);
create policy "anon add guesses" on guesses for insert with check (true);
create policy "anon edit guesses" on guesses for update using (true) with check (true);

-- Events: insert only.
create policy "anon add events" on events for insert with check (true);
