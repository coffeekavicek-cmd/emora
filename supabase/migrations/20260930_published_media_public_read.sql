grant select on public.site_media to anon, authenticated;

drop policy if exists site_media_public_published on public.site_media;
create policy site_media_public_published on public.site_media
for select to anon, authenticated
using (
  bucket_id='emora-published'
  and exists (
    select 1 from public.sites s
    where s.id=site_media.site_id and s.status='published'
  )
);
