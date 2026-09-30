create or replace function public.revoke_site_after_last_refund()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'refunded' and old.status = 'paid' then
    if not exists (
      select 1 from public.orders o
      where o.site_id = new.site_id
        and o.status = 'paid'
        and o.id <> new.id
    ) then
      update public.sites
      set status = 'draft', published_at = null
      where id = new.site_id
        and status = 'published';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.revoke_site_after_last_refund() from public, anon, authenticated;

drop trigger if exists trg_revoke_site_after_last_refund on public.orders;
create trigger trg_revoke_site_after_last_refund
after update of status on public.orders
for each row
when (old.status is distinct from new.status)
execute function public.revoke_site_after_last_refund();
