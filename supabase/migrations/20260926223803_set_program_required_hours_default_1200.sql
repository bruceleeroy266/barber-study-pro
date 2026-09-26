-- E11: Align the fallback program-hour default with ASCYN PRO's current
-- barber-program baseline. Existing configured program rows are unchanged.
alter table public.programs
  alter column required_hours set default 1200;
