drop policy if exists sites_update_owner on public.sites;
create policy sites_update_owner on public.sites
for update to authenticated
using (
  owner_id = (select auth.uid())
  and status = 'draft'
)
with check (
  owner_id = (select auth.uid())
  and status = 'draft'
  and not exists (
    select 1 from public.orders o
    where o.site_id = sites.id
      and o.owner_id = (select auth.uid())
      and o.status = 'processing'
  )
);

drop policy if exists sites_delete_owner on public.sites;
create policy sites_delete_owner on public.sites
for delete to authenticated
using (
  owner_id = (select auth.uid())
  and status = 'draft'
);

drop policy if exists site_media_owner_insert on public.site_media;
create policy site_media_owner_insert on public.site_media
for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and exists (
    select 1 from public.sites s
    where s.id = site_media.site_id
      and s.owner_id = (select auth.uid())
      and s.status = 'draft'
  )
  and not exists (
    select 1 from public.orders o
    where o.site_id = site_media.site_id
      and o.owner_id = (select auth.uid())
      and o.status = 'processing'
  )
);

drop policy if exists site_media_owner_update on public.site_media;
create policy site_media_owner_update on public.site_media
for update to authenticated
using (
  owner_id = (select auth.uid())
  and exists (
    select 1 from public.sites s
    where s.id = site_media.site_id
      and s.owner_id = (select auth.uid())
      and s.status = 'draft'
  )
  and not exists (
    select 1 from public.orders o
    where o.site_id = site_media.site_id
      and o.owner_id = (select auth.uid())
      and o.status = 'processing'
  )
)
with check (
  owner_id = (select auth.uid())
  and exists (
    select 1 from public.sites s
    where s.id = site_media.site_id
      and s.owner_id = (select auth.uid())
      and s.status = 'draft'
  )
  and not exists (
    select 1 from public.orders o
    where o.site_id = site_media.site_id
      and o.owner_id = (select auth.uid())
      and o.status = 'processing'
  )
);

drop policy if exists site_media_owner_delete on public.site_media;
create policy site_media_owner_delete on public.site_media
for delete to authenticated
using (
  owner_id = (select auth.uid())
  and exists (
    select 1 from public.sites s
    where s.id = site_media.site_id
      and s.owner_id = (select auth.uid())
      and s.status = 'draft'
  )
  and not exists (
    select 1 from public.orders o
    where o.site_id = site_media.site_id
      and o.owner_id = (select auth.uid())
      and o.status = 'processing'
  )
);
