-- Add a 'waitlist' state to the tickets.status column so full events can hold a waitlist.
-- Handles both an enum-backed status and a plain text status column defensively.
do $$
declare
    type_exists boolean;
    has_waitlist boolean;
begin
    select exists (
        select 1 from pg_type where typname = 'ticket_status'
    ) into type_exists;

    if type_exists then
        select exists (
            select 1
            from pg_type t
            join pg_enum e on e.enumtypid = t.oid
            where t.typname = 'ticket_status'
              and e.enumlabel = 'waitlist'
        ) into has_waitlist;

        if not has_waitlist then
            execute 'alter type ticket_status add value ''waitlist''';
        end if;
    else
        -- Status is a text column (no enum). No schema change required for the new value,
        -- but loosen any overly strict check constraint if one exists.
        if exists (
            select 1
            from pg_constraint c
            join pg_class tbl on tbl.oid = c.conrelid
            where tbl.relname = 'tickets'
              and c.contype = 'c'
              and c.conname = 'tickets_status_check'
        ) then
            execute 'alter table tickets drop constraint tickets_status_check';
            execute 'alter table tickets add constraint tickets_status_check check (status in (''approved'', ''pending'', ''rejected'', ''waitlist''))';
        end if;
    end if;
end $$;
