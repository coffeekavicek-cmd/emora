-- EMORA V10 wedding RSVP: yes requires an actual positive headcount;
-- maybe/no always store zero attendees. Guest-link token and active-site
-- checks remain mandatory in the SECURITY DEFINER RPC.
alter table public.rsvps
add constraint rsvps_answer_attendee_consistency
check ((answer='yes' and attendees between 1 and 20)
    or (answer in ('no','maybe') and attendees=0));

create or replace function public.submit_guest_rsvp(
 p_token uuid,p_answer text,p_attendees integer,p_message text default ''
) returns boolean
language plpgsql security definer set search_path = public
as $$
declare
 v_guest public.guests%rowtype;
 v_count integer;
begin
 if p_answer is null or p_answer not in ('yes','no','maybe') then
  raise exception 'invalid_answer';
 end if;
 select * into v_guest from public.guests where token=p_token limit 1;
 if v_guest.id is null then raise exception 'guest_not_found'; end if;
 if not exists(select 1 from public.published_sites where project_id=v_guest.project_id and is_active=true) then
  raise exception 'site_unavailable';
 end if;
 if p_answer='yes' then
  if p_attendees is null or p_attendees<1 or p_attendees>v_guest.party_size then
   raise exception 'invalid_attendees';
  end if;
  v_count=p_attendees;
 else
  v_count=0;
 end if;
 insert into public.rsvps(guest_id,project_id,answer,attendees,message,submitted_at,updated_at)
 values(v_guest.id,v_guest.project_id,p_answer,v_count,left(coalesce(p_message,''),500),now(),now())
 on conflict (guest_id) do update set
 answer=excluded.answer,attendees=excluded.attendees,message=excluded.message,
 submitted_at=now(),updated_at=now();
 insert into public.project_events(project_id,guest_id,event_type)
 values(v_guest.project_id,v_guest.id,'rsvp');
 return true;
end;
$$;
