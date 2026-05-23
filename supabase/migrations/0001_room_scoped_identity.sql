-- Room-scoped identity & uniqueness. Fixes cross-room contamination:
-- a participant in one room can no longer collide with / overwrite another room.
-- Applied to the Mutuals project (lgzfptunoyljwyucishq) only.

-- Clear pre-launch test data so the new unique constraints add cleanly.
truncate table groups cascade;

-- Drop any existing UNIQUE constraints on answers/guesses (names may vary), then
-- re-add them scoped to the room.
do $$
declare c text;
begin
  for c in select conname from pg_constraint where conrelid = 'answers'::regclass and contype = 'u' loop
    execute 'alter table answers drop constraint ' || quote_ident(c);
  end loop;
  for c in select conname from pg_constraint where conrelid = 'guesses'::regclass and contype = 'u' loop
    execute 'alter table guesses drop constraint ' || quote_ident(c);
  end loop;
end $$;

alter table participants add constraint participants_group_display_key unique (group_id, display_name);
alter table answers add constraint answers_group_participant_question_key unique (group_id, participant_id, question_id);
alter table guesses add constraint guesses_group_guesser_target_question_key unique (group_id, guesser_id, target_id, question_id);

notify pgrst, 'reload schema';
