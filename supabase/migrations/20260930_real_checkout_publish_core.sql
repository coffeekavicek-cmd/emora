create table if not exists public.plans (
  code text primary key,
  name text not null,
  price_uzs integer not null check (price_uzs > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.plans(code,name,price_uzs,active) values
  ('starter','Template',49990,true),
  ('plus','Template + AI',69990,true),
  ('custom','Custom AI',199990,true)
on conflict (code) do update set
  name=excluded.name,
  price_uzs=excluded.price_uzs,
  active=excluded.active,
  updated_at=now();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  plan_code text not null references public.plans(code),
  amount_uzs integer not null check (amount_uzs > 0),
  currency text not null default 'UZS' check (currency='UZS'),
  provider text check (provider in ('click','payme')),
  status text not null default 'pending' check (status in ('pending','processing','paid','failed','cancelled','refunded')),
  provider_order_ref text,
  idempotency_key uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  unique(idempotency_key)
);

create index if not exists orders_owner_created_idx on public.orders(owner_id,created_at desc);
create index if not exists orders_site_status_idx on public.orders(site_id,status);
create unique index if not exists orders_provider_ref_uq on public.orders(provider,provider_order_ref) where provider_order_ref is not null;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null check (provider in ('click','payme')),
  external_transaction_id text,
  state text not null default 'created' check (state in ('created','processing','performed','cancelled','failed','refunded')),
  amount_uzs integer not null check (amount_uzs > 0),
  provider_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_order_created_idx on public.payments(order_id,created_at desc);
create unique index if not exists payments_provider_tx_uq on public.payments(provider,external_transaction_id) where external_transaction_id is not null;

create table if not exists public.site_media (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('photo','portrait','video','music')),
  bucket_id text not null check (bucket_id in ('emora-drafts','emora-published')),
  object_path text not null,
  sort_order integer not null default 0 check (sort_order >= 0 and sort_order <= 99),
  created_at timestamptz not null default now(),
  unique(site_id,object_path)
);

create index if not exists site_media_site_sort_idx on public.site_media(site_id,kind,sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists plans_set_updated_at on public.plans;
create trigger plans_set_updated_at before update on public.plans for each row execute function public.set_updated_at();
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();
drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments for each row execute function public.set_updated_at();
drop trigger if exists sites_set_updated_at on public.sites;
create trigger sites_set_updated_at before update on public.sites for each row execute function public.set_updated_at();

alter table public.plans enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.site_media enable row level security;

drop policy if exists plans_public_read_active on public.plans;
create policy plans_public_read_active on public.plans for select to anon, authenticated using (active=true);

drop policy if exists orders_owner_select on public.orders;
create policy orders_owner_select on public.orders for select to authenticated using (owner_id=(select auth.uid()));

drop policy if exists site_media_owner_select on public.site_media;
create policy site_media_owner_select on public.site_media for select to authenticated using (owner_id=(select auth.uid()));
drop policy if exists site_media_owner_insert on public.site_media;
create policy site_media_owner_insert on public.site_media for insert to authenticated with check (owner_id=(select auth.uid()) and exists(select 1 from public.sites s where s.id=site_id and s.owner_id=(select auth.uid())));
drop policy if exists site_media_owner_update on public.site_media;
create policy site_media_owner_update on public.site_media for update to authenticated using (owner_id=(select auth.uid())) with check (owner_id=(select auth.uid()) and exists(select 1 from public.sites s where s.id=site_id and s.owner_id=(select auth.uid())));
drop policy if exists site_media_owner_delete on public.site_media;
create policy site_media_owner_delete on public.site_media for delete to authenticated using (owner_id=(select auth.uid()));

drop policy if exists sites_insert_owner on public.sites;
create policy sites_insert_owner on public.sites for insert to authenticated with check (owner_id=(select auth.uid()) and status <> 'published');
drop policy if exists sites_update_owner on public.sites;
create policy sites_update_owner on public.sites for update to authenticated
using (owner_id=(select auth.uid()))
with check (
  owner_id=(select auth.uid()) and (
    status <> 'published' or exists (
      select 1 from public.orders o where o.site_id=sites.id and o.owner_id=(select auth.uid()) and o.status='paid'
    )
  )
);

grant select on public.plans to anon, authenticated;
grant select on public.orders to authenticated;
grant select,insert,update,delete on public.site_media to authenticated;
revoke all on public.payments from anon, authenticated;
revoke insert,update,delete on public.orders from anon, authenticated;

drop policy if exists emora_draft_update_own on storage.objects;
create policy emora_draft_update_own on storage.objects for update to authenticated
using (bucket_id='emora-drafts' and split_part(name,'/',1)=(select auth.uid())::text)
with check (bucket_id='emora-drafts' and split_part(name,'/',1)=(select auth.uid())::text);
