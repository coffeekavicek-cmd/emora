drop index if exists public.orders_one_active_checkout_uq;
create unique index if not exists orders_one_active_checkout_per_site_uq
on public.orders(site_id)
where status in ('pending','processing');
