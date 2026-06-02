-- Campaign interest targeting
alter table public.campaigns
  add column if not exists interests text[] not null default '{}';
