create index if not exists orders_plan_code_idx on public.orders(plan_code);
create index if not exists site_media_owner_idx on public.site_media(owner_id);

drop policy if exists site_media_owner_select on public.site_media;
drop policy if exists site_media_public_published on public.site_media;

create policy site_media_public_published_anon on public.site_media
for select to anon
using (
  bucket_id = 'emora-published'
  and exists (
    select 1 from public.sites s
    where s.id = site_media.site_id
      and s.status = 'published'
  )
);

create policy site_media_authenticated_read on public.site_media
for select to authenticated
using (
  owner_id = (select auth.uid())
  or (
    bucket_id = 'emora-published'
    and exists (
      select 1 from public.sites s
      where s.id = site_media.site_id
        and s.status = 'published'
    )
  )
);
