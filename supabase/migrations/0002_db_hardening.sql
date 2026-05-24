-- DB hardening (Chunk 25): client-id identity, no anon delete, event logging.
-- Correctness/security only — no gameplay or data-shape changes for the app.
-- Applied to the Mutuals project (lgzfptunoyljwyucishq) only. Idempotent.

-- 1) Per-room client identity so duplicate display names no longer collide.
--    Identity moves from (group_id, display_name) to (group_id, client_id).
alter table participants add column if not exists client_id text;

-- Drop every existing UNIQUE constraint on participants (the display-name-scoped
-- ones), then key identity on (group_id, client_id). Existing rows keep a null
-- client_id — nulls are distinct under UNIQUE, so the new constraint adds cleanly.
-- Running again simply drops + re-adds the client key (idempotent).
do $$
declare c text;
begin
  for c in select conname from pg_constraint where conrelid = 'participants'::regclass and contype = 'u' loop
    execute 'alter table participants drop constraint ' || quote_ident(c);
  end loop;
end $$;

alter table participants add constraint participants_group_client_key unique (group_id, client_id);

-- 2) Replace permissive `for all` RLS with explicit select/insert/update.
--    No delete policy anywhere => anon can no longer delete rooms or rows.
--    (upserts need both insert AND update policies; reads need select.)
drop policy if exists "demo all groups" on groups;
drop policy if exists "demo all participants" on participants;
drop policy if exists "demo all answers" on answers;
drop policy if exists "demo all guesses" on guesses;

drop policy if exists "anon read groups" on groups;
drop policy if exists "anon add groups" on groups;
drop policy if exists "anon edit groups" on groups;
create policy "anon read groups" on groups for select using (true);
create policy "anon add groups" on groups for insert with check (true);
create policy "anon edit groups" on groups for update using (true) with check (true);

drop policy if exists "anon read participants" on participants;
drop policy if exists "anon add participants" on participants;
drop policy if exists "anon edit participants" on participants;
create policy "anon read participants" on participants for select using (true);
create policy "anon add participants" on participants for insert with check (true);
create policy "anon edit participants" on participants for update using (true) with check (true);

drop policy if exists "anon read answers" on answers;
drop policy if exists "anon add answers" on answers;
drop policy if exists "anon edit answers" on answers;
create policy "anon read answers" on answers for select using (true);
create policy "anon add answers" on answers for insert with check (true);
create policy "anon edit answers" on answers for update using (true) with check (true);

drop policy if exists "anon read guesses" on guesses;
drop policy if exists "anon add guesses" on guesses;
drop policy if exists "anon edit guesses" on guesses;
create policy "anon read guesses" on guesses for select using (true);
create policy "anon add guesses" on guesses for insert with check (true);
create policy "anon edit guesses" on guesses for update using (true) with check (true);

-- 3) Lightweight, insert-only event logging (no anon select/update/delete).
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  group_id text,
  participant_id uuid,
  props jsonb,
  created_at timestamptz not null default now()
);
create index if not exists events_group_idx on events (group_id);
alter table events enable row level security;
drop policy if exists "anon add events" on events;
create policy "anon add events" on events for insert with check (true);

notify pgrst, 'reload schema';
