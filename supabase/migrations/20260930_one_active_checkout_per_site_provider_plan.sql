create unique index if not exists orders_one_active_checkout_uq
on public.orders(site_id, plan_code, provider)
where status in ('pending','processing');
