create or replace function public.project_analytics(p_project_id uuid)
returns table(total_views bigint,total_rsvps bigint,yes_count bigint,maybe_count bigint,no_count bigint,attendees_total bigint,guests_total bigint)
language sql
security invoker
set search_path to ''
as $$
  select
    (select count(*) from public.project_events e where e.project_id=p_project_id and e.event_type='view'),
    (select count(*) from public.rsvps r where r.project_id=p_project_id),
    (select count(*) from public.rsvps r where r.project_id=p_project_id and r.answer='yes'),
    (select count(*) from public.rsvps r where r.project_id=p_project_id and r.answer='maybe'),
    (select count(*) from public.rsvps r where r.project_id=p_project_id and r.answer='no'),
    (select coalesce(sum(attendees),0) from public.rsvps r where r.project_id=p_project_id and r.answer='yes'),
    (select count(*) from public.guests g where g.project_id=p_project_id)
  where exists (
    select 1 from public.projects p where p.id=p_project_id and p.owner_id=(select auth.uid())
  )
$$;
revoke all on function public.project_analytics(uuid) from public,anon;
grant execute on function public.project_analytics(uuid) to authenticated,service_role;
create index if not exists payment_orders_plan_slug_idx on public.payment_orders(plan_slug);
